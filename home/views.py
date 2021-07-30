from django.http.response import StreamingHttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, 'home/index.html')
