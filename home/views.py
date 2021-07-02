from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse
# Create your views here.
data = ""
def index(request):
    return render(request, 'home/index.html')
