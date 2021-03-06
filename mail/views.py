import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import JsonResponse
from django.shortcuts import HttpResponse, HttpResponseRedirect, render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt

from .models import User, Email


def index(request, mailbox="inbox", id = None):
    # Authenticated users view their inbox
    if request.user.is_authenticated:
        return render(request, "mail/inbox.html",{
            'mailbox' : mailbox,
            'id' : id,
        })

    # Everyone else is prompted to sign in
    else:
        return HttpResponseRedirect(reverse("mail:login"))


@csrf_exempt
@login_required
def compose(request):

    # Composing a new email must be via POST
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    # Check recipient emails
    data = json.loads(request.body)
    emails = [email.strip() for email in data.get("recipients").split(",")]
    if emails == [""]:
        return JsonResponse({
            "error": "At least one recipient required."
        }, status=400)

    # Convert email addresses to users
    recipients = []
    for email in emails:
        try:
            if len(email) == 0:
                continue
            user = User.objects.get(email=email)
            recipients.append(user)
        except User.DoesNotExist:
            return JsonResponse({
                "error": f"User with email {email} does not exist."
            }, status=400)

    # Get contents of email
    subject = data.get("subject", "")
    body = data.get("body", "")

    body = body.replace("\r\n", '\r<br>\n')

    # Create one email for each recipient, plus sender
    users = set()
    users.add(request.user)
    users.update(recipients)
    for user in users:
        email = Email(
            user=user,
            sender=request.user,
            subject=subject,
            body=body,
            read= user == request.user,
        )
        email.save()
        for recipient in recipients:
            email.recipients.add(recipient)
        email.save()

    return JsonResponse({"message": "Email sent successfully.","data": data}, status=201)


@login_required
def mailbox(request, mailbox):

    # Filter emails returned based on mailbox
    if mailbox == "inbox":
        emails = Email.objects.filter(
            user=request.user, archived=False
        ).exclude(
            sender = request.user,
            archived = True,
        )
    elif mailbox == "sent":
        emails = Email.objects.filter(
            user=request.user,
            sender=request.user
        )
    elif mailbox == "archive":
        emails = Email.objects.filter(
            user=request.user,
            archived=True
        )
    else:
        return JsonResponse({"error": "Invalid mailbox."}, status=400)

    # Return emails in reverse chronologial order
    emails = emails.order_by("-timestamp").all()
    return JsonResponse([email.serialize() for email in emails], safe=False)

@csrf_exempt
@login_required
def email(request, email_id):

    # Query for requested email
    try:
        email = Email.objects.get(user=request.user, pk=email_id)
    except:
        return JsonResponse({"error": "Email not found."}, status=404)

    # Return email contents
    # print("checking get method")
    if request.method == "GET":
        return JsonResponse(email.serialize())

    # Update whether email is read or should be archived
    elif request.method == "PUT":
        msg = "No input"
        data = json.loads(request.body)
        if data.get("read") is not None:
            # print(data.get("read", ""))
            email.read = data.get("read")
            msg = "Got Read/Unread" + str(data.get("read"))
            email.save()
        elif data.get("archive") is not None:
            # print(data.get("read", ""))
            email.archived = data.get("archive")
            msg = "Got Archived" + str(data.get("archive"))
            email.save()
        elif data.get("delete") is not None:
            # print(data.get("delete", ""))
            email.save()
            email.delete()
            msg = "Got Delete" + str(data.get("delete"))
        return JsonResponse({
            "status": msg,
            "input": data
        },status=200)

    # Email must be via GET or PUT
    else:
        return JsonResponse({
            "error": "GET or PUT request required."
        }, status=400)

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        try:
            email = request.POST["email"]
            password = request.POST["password"]
            user = User.objects.get(email=email)
            user = authenticate(request, username=user.username, password=password)
        except:
            user = None
        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("mail:index"))
        else:
            return render(request, "mail/login.html", {
                "message": "Invalid email and/or password."
            })
    else:
        return render(request, "mail/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("mail:index"))


def register(request):
    if request.method == "POST":
        username = request.POST["Name"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "mail/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError as e:
            # print(e)
            return render(request, "mail/register.html", {
                "message": "Email address already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("mail:index"))
    else:
        logout(request)
        return render(request, "mail/register.html")

@csrf_exempt
def usersList(request):
    Users = User.objects.all()
    return JsonResponse([user.serialize() for user in Users], safe=False)
