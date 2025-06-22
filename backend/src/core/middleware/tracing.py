# middleware/tracing.py
import time
from django.utils.deprecation import MiddlewareMixin
from opentelemetry import trace
from opentelemetry.trace import Status, StatusCode

class TracingMiddleware(MiddlewareMixin):
    def __init__(self, get_response):
        self.get_response = get_response
        self.tracer = trace.get_tracer(__name__)
        super().__init__(get_response)

    def process_request(self, request):
        # Start a span for the entire request
        span = self.tracer.start_span(f"{request.method} {request.path}")

        # Add request attributes
        span.set_attribute("http.method", request.method)
        span.set_attribute("http.url", request.build_absolute_uri())
        span.set_attribute("http.scheme", request.scheme)
        span.set_attribute("http.host", request.get_host())
        span.set_attribute("http.target", request.path)
        span.set_attribute("http.user_agent", request.META.get('HTTP_USER_AGENT', ''))
        span.set_attribute("http.remote_addr", self.get_client_ip(request))

        if hasattr(request, 'user') and request.user.is_authenticated:
            span.set_attribute("user.id", str(request.user.id))
            span.set_attribute("user.username", request.user.username)

        # Store span and start time in request for later use
        request._tracing_span = span
        request._tracing_start_time = time.time()

        return None

    def process_response(self, request, response):
        if hasattr(request, '_tracing_span'):
            span = request._tracing_span

            # Add response attributes
            span.set_attribute("http.status_code", response.status_code)
            span.set_attribute("http.response.size", len(response.content))

            # Calculate request duration
            if hasattr(request, '_tracing_start_time'):
                duration = time.time() - request._tracing_start_time
                span.set_attribute("http.request.duration", duration)

            # Set span status based on response status
            if response.status_code >= 400:
                if response.status_code >= 500:
                    span.set_status(Status(StatusCode.ERROR, f"HTTP {response.status_code}"))
                else:
                    span.set_status(Status(StatusCode.OK))
            else:
                span.set_status(Status(StatusCode.OK))

            # End the span
            span.end()

        return response

    def process_exception(self, request, exception):
        if hasattr(request, '_tracing_span'):
            span = request._tracing_span

            # Record the exception
            span.record_exception(exception)
            span.set_status(Status(StatusCode.ERROR, str(exception)))
            span.end()

        return None

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip