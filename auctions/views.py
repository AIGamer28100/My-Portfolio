from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django import forms

import time
from .models import *

# Home Page
def index(request):
    if request.user.is_authenticated:
        Wishlists = Wishlist.objects.get(user = request.user.id)
        Wishlists = Wishlists.wishlist.all()
        Active = [i.title for i in Wishlists]
        return render(request, "auctions/index.html",{
            "CategoriesListing": Listing.objects.all().order_by("active", "created").reverse(),
            "Wish": len(Wishlists),
            "Active": Active,
            "cat": [(i.id,i.category.all()) for i in Listing.objects.all()],
        })
    else:
        return render(request, "auctions/index.html",{
            "CategoriesListing": Listing.objects.all().order_by("active").reverse(),
            "cat": [(i.id,i.category.all()) for i in Listing.objects.all()],
        })

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
            W = Wishlist(user=user)
            W.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")

def Categories(request):
    if request.user.is_authenticated:
        Wishlists = Wishlist.objects.get(user = request.user.id)
        Wishlists = Wishlists.wishlist.all()
    else:
        Wishlists = []
    return render(request, "auctions/categories.html",{
        "Categories": Category.objects.all().order_by("category"),
        "Wish": len(Wishlists),
    })

def CategoryListing(request,CategoryList):
    try:
        if request.user.is_authenticated:
            Wishlists = Wishlist.objects.get(user = request.user.id)
            Wishlists = Wishlists.wishlist.all()
        else:
            Wishlists = []
        Active = [i.title for i in Wishlists]
    except:
        Active = None
    List = Category.objects.get(pk=CategoryList)
    return render(request, "auctions/categories.html",{
        "CategoriesListing": List.Category.all(),
        "Wish": len(Wishlists),
        "Active": Active,
        "Cat": Category.objects.get(id=CategoryList).category,
        "Cat_Id": CategoryList,
    })


def Profile(request,UserId):
    if request.user.is_authenticated:
        Wishlists = Wishlist.objects.get(user = request.user.id)
        Wishlists = Wishlists.wishlist.all()
    else:
        Wishlists = []
    Active = [i.title for i in Wishlists]
    return render(request, "auctions/profile.html",{
        "Profile": User.objects.get(pk=UserId),
        "UserListing": Listing.objects.filter(user=UserId),
        "Wish": len(Wishlists),
        "Wishlist": Wishlists,
        "Active": Active,
    })

def editprofile(request,UserId):
    if request.method == "POST":
        if request.POST['edit'] == "submit":
            user = User.objects.get(pk=request.user.id)
            user.first_name = request.POST['First_name']
            user.last_name = request.POST['Last_name']
            user.email = request.POST['Email']
            dp = request.POST['dp']
            if len(dp)<1:
                dp = "https://www.dia.org/sites/default/files/No_Img_Avail.jpg"
            elif dp == user.dp:
                pass
            else:
                if "https://drive.google.com/" in dp[:32]:
                    dp = dp[32:-17]
                    dp = "https://drive.google.com/thumbnail?id="+dp
            user.dp = dp
            user.save()
            return HttpResponseRedirect(reverse("Profile", args=[UserId]))
        return render(request, "auctions/editprofile.html",{
            "Profile": User.objects.get(pk=UserId),
        })
    return HttpResponseRedirect(reverse("Profile", args=[UserId]))

@login_required(login_url="/login")
def Item(request,title,id):
    try:
        Wishlists = Wishlist.objects.get(user = request.user.id)
        Wishlists = Wishlists.wishlist.all()
        Active = [i.title for i in Wishlists]
        Item = Listing.objects.get(pk=id)
        comments = Comment.objects.filter(item = Item.id)
        count = len(Bid.objects.filter(item = id))
        if request.method == "POST":
            if request.POST['submit'] == 'Place Bid':
                try:
                    if int(request.POST['Bidding']) > int(Item.bid):
                        new_bid = Bid(
                            item=Listing.objects.get(pk=id),
                            bidder=User.objects.get(username=request.user),
                            bid=request.POST['Bidding']
                        )
                        new_bid.save()
                        Item.bid = request.POST['Bidding']
                        Item.save()
                        newcomment = Comment(
                            item = Listing.objects.get(pk=id),
                            user = User.objects.get(username=request.user),
                            comment = f'<div class="alert alert-primary" role="alert"><a href="/Users/{request.user.id}">{request.user.username}</a> Bid {request.POST["Bidding"]}.00 ₹</div>',
                        )
                        newcomment.save()
                        return HttpResponseRedirect(reverse('Item',args=[Item.title,Item.id]))
                except:
                    pass
            elif request.POST['submit'] == 'transferownership':
                try:
                    Item.user = User.objects.get(pk=request.POST['TOto'])
                    Item.save()
                    return HttpResponseRedirect(reverse('Item',args=[Item.title,Item.id]))
                except:
                    return HttpResponseRedirect(reverse('Item',args=[Item.title,Item.id]))
            elif request.POST['submit'] == 'ADDCOMMENT':
                try:
                    newcom = request.POST['comment']
                    newcom = newcom.replace('\n',"<br>")
                    texts = newcom.split()
                    for i in range(len(texts)):
                        if texts[i].startswith('@'):
                            comid = User.objects.get(username=texts[i][1:])
                            texts[i] = f'<a href="/Users/{comid.id}">@{texts[i][1:]}</a>'
                    newcom = " ".join(texts)
                    newcomment = Comment(
                        item = Listing.objects.get(pk=id),
                        user = User.objects.get(username=request.user),
                        comment = newcom,
                    )
                    newcomment.save()
                    return HttpResponseRedirect(reverse('Item',args=[Item.title,Item.id]))
                except:
                    pass
            elif request.POST['submit'] == 'del':
                C = Comment.objects.get(pk = request.POST['commentid'])
                C.delete()
                return HttpResponseRedirect(reverse('Item',args=[Item.title,Item.id]))
            elif request.POST['submit'] == 'reply':
                C = Comment.objects.get(user = request.POST['commentby'])
                return render(request, "auctions/Items.html",{
                    "List": Item,
                    "Active": Active,
                    "Wish": len(Wishlists),
                    "count": count,
                    "commentcount": len(comments),
                    "comments": comments.order_by('created').reverse(),
                    "replyto": f"@{C.user.username}",
                })
        request.method = 'GET'
        if count > 1 and Item.active == False:
            bids = Bid.objects.filter(item = Item.id)
            for i in bids:
                if i.bid == Item.bid:
                    winner = i.bidder
            return render(request, "auctions/winner.html",{
                "List": Item,
                "Active": Active,
                "Wish": len(Wishlists),
                "count": count,
                "commentcount": len(comments),
                "comments": comments.order_by('created').reverse(),
                "bids" : bids,
                "winner" : winner,
            })
        return render(request, "auctions/Items.html",{
            "List": Item,
            "Active": Active,
            "Wish": len(Wishlists),
            "count": count,
            "commentcount": len(comments),
            "comments": comments.order_by('created').reverse(),
        })
    except:
        return HttpResponseRedirect(reverse("index"))

@login_required(login_url="/login")
def wish(request):
    Wishlists = Wishlist.objects.get(user = request.user.id)
    Wishlists = Wishlists.wishlist.all()
    Active = [i.title for i in Wishlists]
    return render(request, "auctions/Wishlist.html",{
        "WishListing": Wishlists,
        "Wish": len(Wishlists),
        "Active": Active,
    })

def addwishlist(request):
    if request.method =="POST":
        id = request.POST['List_id']
        list = Listing.objects.get(id=id)
        W = Wishlist.objects.get(user=request.user.id)
        W.wishlist.add(list)
        W.save()
        page = request.POST['page']
        if page == "profile":
            return HttpResponseRedirect(reverse("Profile",args=[request.user.id]))
        elif page == "wish":
            return HttpResponseRedirect(reverse("Wish"))
        elif page == "cat":
            Cat_Id = request.POST['Cat_Id']
            return HttpResponseRedirect(reverse("CategoryListing",args=[Cat_Id]))
        elif page == "item":
            return HttpResponseRedirect(reverse("Item",args=[list.title,list.id]))
        return HttpResponseRedirect(reverse("index"))
    return HttpResponseRedirect(reverse("index"))

def removewishlist(request):
    if request.method =="POST":
        id = request.POST['List_id']
        list = Listing.objects.get(pk=id)
        W = Wishlist.objects.get(user=request.user.id)
        W.wishlist.remove(list)
        W.save()
        page = request.POST['page']
        if page == "profile":
            return HttpResponseRedirect(reverse("Profile", args=[request.user.id]))
        elif page == "wish":
            return HttpResponseRedirect(reverse("Wish"))
        elif page == "cat":
            Cat_Id = request.POST['Cat_Id']
            return HttpResponseRedirect(reverse("CategoryListing", args=[Cat_Id]))
        elif page == "item":
            return HttpResponseRedirect(reverse("Item",args=[list.title,list.id]))
        return HttpResponseRedirect(reverse("index"))
    return HttpResponseRedirect(reverse("index"))

def editlisting(request,title):
    try:
        Wishlists = Wishlist.objects.get(user = request.user.id)
        Wishlists = Wishlists.wishlist.all()
        Active = [i.title for i in Wishlists]
        Item = Listing.objects.get(title=title)
        count = len(Bid.objects.filter(item = Item.id))
        if request.method == 'POST':
            r = request.POST.getlist('Categories')
            r = [int(i) for i in r]
            reques = request.POST
            if reques['action'] == "addcat":
                cat = request.POST['newcat']
                cx = False
                try:
                    C = Category.objects.get(category=cat)
                    if len(C.category) > 0:
                        x = "Category already exisit"
                        cx = True
                    else:
                        x = Category.objects.create(category=cat)
                        r.append(x.id)
                        x = "Category Added"
                except:
                    x = Category.objects.create(category=cat)
                    r.append(x.id)
                    x = "Category Added"
                return render(request, "auctions/editlisting.html",{
                    "request": request,
                    "r": r,
                    "List": Item,
                    "Active": Active,
                    "Wish": len(Wishlists),
                    "count": count,
                    "Cat": Category.objects.all(),
                    "LC": Item.category.all(),
                    "x": x,
                    "cx": cx,
                })
            elif reques['action'] == "submit":
                Item.title = request.POST['Title']
                Item.discription = request.POST['Discription']
                Item.dp = request.POST['Image']
                try:
                    if request.POST['Active'] == "on":
                        Item.active = True
                except:
                    Item.active = False
                Item.category.clear()
                for i in r:
                    Item.category.add(Category.objects.get(id=i))
                Item.save()
                if count > 1 and Item.active == False:
                    return HttpResponseRedirect(reverse('Item',args=[Item.title,Item.id]))
                return HttpResponseRedirect(reverse('Profile',args=[request.user.id]))
            elif reques['action'] == "delete":
                Item.delete()
                return HttpResponseRedirect(reverse('index'))
            else:
                pass
        return render(request, "auctions/editlisting.html",{
            "List": Item,
            "Active": Active,
            "Wish": len(Wishlists),
            "count": count,
            "Cat": Category.objects.all(),
            "LC": Item.category.all()
        })
    except:
        return HttpResponseRedirect(reverse("index"))

def createlisting(request):
    Wishlists = Wishlist.objects.get(user = request.user.id)
    Wishlists = Wishlists.wishlist.all()
    if request.method == 'POST':
        r = request.POST.getlist('Categories')
        r = [int(i) for i in r]
        if request.POST['action'] == "addcat":
            cat = request.POST['newcat']
            cx = False
            try:
                C = Category.objects.get(category=cat)
                if len(C.category) > 0:
                    x = "Category already exisit"
                    cx = True
                else:
                    x = Category.objects.create(category=cat)
                    x = "Category Added"
            except:
                x = Category.objects.create(category=cat)
                x = "Category Added"
            return HttpResponseRedirect(reverse("createlisting"))
        elif request.POST['action'] == "submit":
            r = request.POST.getlist('Categories')
            r = [int(i) for i in r]
            x = Listing.objects.create(
                user = request.user,
                title = request.POST['Title'],
                discription = request.POST['Discription'],
                image = request.POST['Image'],
                bid = request.POST['Bid'],
                active = True,
            )
            x.category.clear()
            for i in r:
                x.category.add(Category.objects.get(id=i))
            x.save()
            new_bid = Bid(
                item=Listing.objects.get(pk=x.id),
                bidder=User.objects.get(username=request.user),
                bid=request.POST['Bid']
            )
            new_bid.save()
            Item.bid = request.POST['Bid']
            Item.save()
            return HttpResponseRedirect(reverse("Item",args=[x.title,x.id]))
    return render(request, "auctions/createlisting.html",{
        "Wish": len(Wishlists),
        "Cat": Category.objects.all().order_by('category'),
    })



def handler404(request):
    response = HttpResponseRedirect(reverse("index"))
    response.status_code = 404
    return response

def redirect(request, e):
    response = HttpResponseRedirect(reverse("index"))
    response.status_code = 404
    return response
