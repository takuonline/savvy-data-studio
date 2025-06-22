# tracing.py
import os
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.resources import Resource
from opentelemetry.instrumentation.django import DjangoInstrumentor
from opentelemetry.instrumentation.requests import RequestsInstrumentor
from opentelemetry.instrumentation.psycopg2 import Psycopg2Instrumentor

def configure_tracing():
    # Create a resource with service information
    resource = Resource.create({
        "service.name": os.getenv("SERVICE_NAME", "django-app"),
        "service.version": os.getenv("SERVICE_VERSION", "1.0.0"),
        "service.instance.id": os.getenv("HOSTNAME", "localhost"),
    })

    # Set up the tracer provider
    trace.set_tracer_provider(TracerProvider(resource=resource))
    tracer_provider = trace.get_tracer_provider()

    # Configure OTLP exporter for Tempo
    otlp_exporter = OTLPSpanExporter(
        endpoint=os.getenv("TEMPO_ENDPOINT", "http://localhost:4317"),
        insecure=True,  # Set to False if using HTTPS
    )

    # Add the exporter to the tracer provider
    span_processor = BatchSpanProcessor(otlp_exporter)
    tracer_provider.add_span_processor(span_processor)

    # Instrument Django
    DjangoInstrumentor().instrument()

    # Instrument HTTP requests
    RequestsInstrumentor().instrument()

    # Instrument PostgreSQL (if using PostgreSQL)
    # Psycopg2Instrumentor().instrument()

    print("OpenTelemetry tracing configured for Django")