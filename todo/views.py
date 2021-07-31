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
        UserTask.objects.get_or_create(user = request.user)
        return render(request, "todo/index.html",{
            "UserTask" : UserTask.objects.filter(user = request.user)
        })

    # Everyone else is prompted to sign in
    else:
        return HttpResponseRedirect(reverse("todo:login"))

@csrf_exempt
@login_required
def task(request, id):
    # Display Task
    if request.method == "GET":
        task = Task.objects.get(id = id)
        if task.tasks.filter(user=request.user).exists():
            return render(request, "todo/task.html",{
                "Task" : Task.objects.get(id = id),
                "UserTask" : UserTask.objects.filter(user = request.user)
            })
        else:
            return HttpResponseRedirect(reverse("todo:index"))
    # Edit Task
    if request.method == "POST":
        task = Task.objects.get(id = id)
        task.title = request.POST.get('Title')
        task.description = request.POST.get('Description')
        task.status = 'open' if request.POST.get(f'status{id}') else 'closed'
        task.save()
        return HttpResponseRedirect(reverse("todo:task", args=[id]))
    # Must be via GET or POST
    else:
        return HttpResponseRedirect(reverse("todo:index"))



@csrf_exempt
@login_required
def add(request):
    if request.method == "POST":
        task = Task.objects.create(
            title = request.POST.get('Title'),
            description = request.POST.get('Description'),
            status = 'open' if request.POST.get(f'status{id}') else 'closed'
        )

        task.save()
        user = UserTask.objects.get(user = request.user)
        user.tasks.add(task)
        user.save()
        try:
            next = request.GET[f'next']
            nextid = request.GET[f'nextid']
            if nextid == "new":
                nextid = task.id
            return HttpResponseRedirect(reverse(f"todo:{next}", args=[nextid]))
        except:
            try:
                next = request.GET[f'next'] #testing
                return HttpResponseRedirect(reverse(f"todo:{next}"))
            except:
                return HttpResponseRedirect(reverse("todo:index"))
        return HttpResponseRedirect(reverse("todo:index"))
    # Must be via POST
    else:
        return HttpResponseRedirect(reverse("todo:index"))



@csrf_exempt
@login_required
def status(request,id):
    if request.method == "POST":
        task = Task.objects.get(id = id)
        if task.tasks.filter(user=request.user).exists():
            task.status = 'open' if request.POST.get(f'status{id}') else 'closed'
            task.save()
            try:
                next = request.GET[f'next']
                nextid = request.GET[f'nextid']
                return HttpResponseRedirect(reverse(f"todo:{next}", args=[nextid]))
            except:
                try:
                    next = request.GET[f'next']
                    return HttpResponseRedirect(reverse(f"todo:{next}"))
                except:
                    return HttpResponseRedirect(reverse("todo:index"))
        return HttpResponseRedirect(reverse("todo:index"))
    # Must be via PUT
    else:
        return HttpResponseRedirect(reverse("todo:index"))


@csrf_exempt
@login_required
def delete(request,id):
    if request.method == "POST":
        task = Task.objects.get(id = id)
        if task.tasks.filter(user=request.user).exists():
            task.delete()
        return HttpResponseRedirect(reverse("todo:index"))
        # Must be via POST
    else:
        return HttpResponseRedirect(reverse("todo:index"))


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
