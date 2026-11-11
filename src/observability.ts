import { context, propagation, trace } from '@opentelemetry/api';
import { W3CTraceContextPropagator } from '@opentelemetry/core';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { resourceFromAttributes } from '@opentelemetry/resources';
import {
  BatchSpanProcessor,
  ParentBasedSampler,
  TraceIdRatioBasedSampler,
  TracerProvider,
} from '@opentelemetry/sdk-trace';

const serviceVersion = import.meta.env.VITE_GIT_SHA ?? 'dev';
const samplingRatio = Number(import.meta.env.VITE_OTEL_SAMPLE_RATIO ?? '1');

const provider = new TracerProvider({
  resource: resourceFromAttributes({
    'service.name': 'demo-frontend',
    'service.namespace': 'demo-app',
    'service.version': serviceVersion,
    'deployment.environment.name': 'homelab',
    'browser.language': navigator.language,
    'browser.mobile': /Mobi|Android/i.test(navigator.userAgent),
    'browser.platform': navigator.platform,
  }),
  sampler: new ParentBasedSampler({
    root: new TraceIdRatioBasedSampler(samplingRatio),
  }),
  spanProcessors: [
    new BatchSpanProcessor(
      {
        exporter: new OTLPTraceExporter({
          url: `${window.location.origin}/v1/traces`,
        }),
      },
    ),
  ],
});

context.setGlobalContextManager(new ZoneContextManager());
propagation.setGlobalPropagator(new W3CTraceContextPropagator());
trace.setGlobalTracerProvider(provider);

registerInstrumentations({
  instrumentations: [
    new FetchInstrumentation({
      clearTimingResources: true,
      ignoreUrls: [/\/v1\/traces/, /\/healthz$/],
      propagateTraceHeaderCorsUrls: [window.location.origin],
    }),
  ],
});
