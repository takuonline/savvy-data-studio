
import os
import logging
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor, ConsoleSpanExporter
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.resources import Resource
from opentelemetry.instrumentation.django import DjangoInstrumentor
from opentelemetry.instrumentation.requests import RequestsInstrumentor
from opentelemetry.instrumentation.psycopg2 import Psycopg2Instrumentor

logger = logging.getLogger(__name__)

def configure_tracing():
    """Configure OpenTelemetry tracing with safe defaults that won't overload the system"""

    # Check if tracing is enabled (easy kill switch)
    if not os.getenv("ENABLE_TRACING", "true").lower() in ("true", "1", "yes"):
        logger.info("Tracing is disabled via ENABLE_TRACING environment variable")
        return

    try:
        # Create a resource with service information
        resource = Resource.create({
            "service.name": os.getenv("SERVICE_NAME", "django-app"),
            "service.version": os.getenv("SERVICE_VERSION", "1.0.0"),
            "service.instance.id": os.getenv("HOSTNAME", "localhost"),
            "deployment.environment": os.getenv("ENVIRONMENT", "production"),
        })

        # Set up the tracer provider
        tracer_provider = TracerProvider(resource=resource)
        trace.set_tracer_provider(tracer_provider)

        # Configure OTLP exporter for Tempo with aggressive timeouts
        tempo_endpoint = os.getenv("TEMPO_ENDPOINT", "http://tempo:4317")

        otlp_exporter = OTLPSpanExporter(
            endpoint=tempo_endpoint,
            insecure=True,
            timeout=2,  # Fail after 2 seconds, don't hang
        )

        # Configure BatchSpanProcessor with limits to prevent memory/CPU issues
        span_processor = BatchSpanProcessor(
            otlp_exporter,
            max_queue_size=512,        # Limit queue size (default: 2048)
            schedule_delay_millis=2000, # Export every 2 seconds (default: 5000)
            max_export_batch_size=128,  # Smaller batches (default: 512)
            export_timeout_millis=5000, # 5 second export timeout (default: 30000)
        )

        tracer_provider.add_span_processor(span_processor)

        # Instrument Django (only if tracing is working)
        DjangoInstrumentor().instrument(
            excluded_urls="metrics,health,prometheus,/api/v1/metrics,/health,/metrics",
        )

        # Instrument HTTP requests
        RequestsInstrumentor().instrument()

        # Instrument PostgreSQL (uncomment if needed)
        # Psycopg2Instrumentor().instrument(enable_commenter=True, commenter_options={})

        logger.info(f"✓ OpenTelemetry tracing configured for Django → {tempo_endpoint}")

    except Exception as e:
        # If tracing setup fails, DON'T crash the app
        logger.error(f"Failed to configure tracing (continuing without it): {e}")
        # You can optionally set a no-op tracer here
        pass