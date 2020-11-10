from django import forms
from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render
from django.urls import reverse
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

from . import util

import markdown2
import re
import random

def index(request):
    if request.method == "POST":
        x = request.POST['search']
        if x in util.list_entries():
            return HttpResponseRedirect(reverse("encyclopedia:page", args=[x]))
        else:
            y = []
            l = util.list_entries()
            for i in l:
                if x.lower() in i.lower():
                    y.append(i)
            return render(request, "encyclopedia/index.html", {
                "name" : "Wiki",
                "entries": y,
                "title" : f"Found {len(y)} Results",
                "H": "active",
            })
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries(),
        "title" : f"All Pages",
        "name" : "Wiki",
        "H": "active",
    })

def page(request, name):
    return render(request, "encyclopedia/index.html", {
        "name" : name,
        "page": markdown2.markdown(util.get_entry(name)),
        "pa" : True,
        "RP" : "active",
    })

def new(request):
    if request.method == "POST":
        x = request.POST["Title"]
        if x in util.list_entries():
            return render(request, "encyclopedia/editerror.html",{
                "x" : x,
                "name" : "New Page"
            })
        c = request.POST['Content']
        util.save_entry(x,c)
        if x in util.list_entries():
            return render(request, "encyclopedia/index.html", {
                "page": util.get_entry(x),
                "pa" : True
            })
        else:
            return HttpResponseRedirect(reverse('encyclopedia:new'))
    return render(request, "encyclopedia/new.html", {
        "entries": util.list_entries(),
        "name" : "Wiki",
        "CNP" : "active",
    })

def edit(request,title):
    if request.method == "POST":
        x = request.POST['Title']
        filename = f"entries/{x}.md"
        if default_storage.exists(filename):
            default_storage.delete(filename)
        c = request.POST['Content']
        util.save_entry(x,c)
        if len(c) > 0:
            if x in util.list_entries():
                return HttpResponseRedirect(reverse('encyclopedia:page', args=[x]))
            else:
                return render(request, "encyclopedia/index.html", {
                "page": util.get_entry(x),
                "pa" : True
                })
        else:
            return HttpResponseRedirect(reverse('encyclopedia:new'))
    if title in util.list_entries():
        t = title
        c = util.get_entry(title)
    else:
        return HttpResponseRedirect(reverse('encyclopedia:new'))
    return render(request, "encyclopedia/edit.html", {
        "name" : title,
        "title" : t,
        "content" : c,
        "EP" : "active disabled",
        "pa" : True,
    })

def Random(request):
    l = util.list_entries()
    x = random.choice(l)
    return HttpResponseRedirect(reverse('encyclopedia:page', args=[x]))
