from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse
# Create your views here.
data = ""
def index(request):
    return render(request, 'home/index.html')

def read(request):
    return render(request, 'home/html.html')

@csrf_exempt
def Unread(request):
    data = ""
    if request.method == 'POST':
        data = request.POST.get("videoURL")
        print(data)
    return HttpResponse(f"{data}")
