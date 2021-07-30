from django.shortcuts import render, HttpResponse, HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse
from django.urls import reverse


from .models import *


# Create your views here.
def index(request):
    # Authenticated users view their inbox
    if request.user.is_authenticated:
        return render(request, "todo/index.html",{
            "Task" : Task.objects.all(),
            "UserTask" : UserTask.objects.all()
        })

    # Everyone else is prompted to sign in
    else:
        return HttpResponseRedirect(reverse("todo:login"))


def add(request):
    pass

def delete(request,id):
    pass

def open(request,id):
    pass

def close(request,id):
    pass



def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        try:
            username = request.POST["username"]
            password = request.POST["password"]
            user = authenticate(request, username=username, password=password)
        except:
            user = None
        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("todo:index"))
        else:
            return render(request, "todo/login.html", {
                "message": "Invalid email and/or password."
            })
    else:
        return render(request, "todo/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("todo:index"))


def register(request):
    if request.method == "POST":
        username = request.POST["Name"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "todo/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError as e:
            # print(e)
            return render(request, "todo/register.html", {
                "message": "Email address already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("todo:index"))
    else:
        logout(request)
        return render(request, "todo/register.html")
