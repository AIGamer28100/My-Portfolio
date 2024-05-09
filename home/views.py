from django.http.response import StreamingHttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render

# Create your views here.
def v1(request):
    return render(request, 'v1/index.html')

def v2(request):
    return render(request, 'v2/index.html')