{{/*
Expand the name of the chart.
*/}}
{{- define "vue3-scaffold.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "vue3-scaffold.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" $name .Release.Name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Define the config pattern of the chart based on options.
*/}}
{{- define "vue3-scaffold.configname" -}}
{{- if .Values.config.releaseScoped }}
{{- include "vue3-scaffold.fullname" . }}
{{- else }}
{{- include "vue3-scaffold.name" . }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "vue3-scaffold.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Application labels
*/}}
{{- define "vue3-scaffold.labels" -}}
{{ include "vue3-scaffold.selectorLabels" . }}
{{ include "common.labels" . }}
app: {{ include "vue3-scaffold.fullname" . }}
app.kubernetes.io/component: backend
{{- end }}

{{/*
Selector labels
*/}}
{{- define "vue3-scaffold.selectorLabels" -}}
app.kubernetes.io/name: {{ include "vue3-scaffold.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "common.labels" -}}
helm.sh/chart: {{ include "vue3-scaffold.chart" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
app.kubernetes.io/part-of: {{ .Release.Name }}
app.openshift.io/runtime: nodejs
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "vue3-scaffold.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "vue3-scaffold.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}
