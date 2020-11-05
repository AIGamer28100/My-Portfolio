from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect
from .models import *
from django.core.paginator import Paginator, EmptyPage,PageNotAnInteger
from django.views.generic import ListView
from django.core.mail import send_mail
# Create your views here.

def post_share(request, post_id):
    # Retrieve post by id
    post = get_object_or_404(Post, id=post_id, status='published')
    sent = False

    if request.method == 'POST':
        # Form was submitted
        # Form fields passed validation
        cd = request.POST
        post_url = request.build_absolute_uri(post.get_absolute_url())
        subject = f'{cd["name"]} ({cd["from"]}) recommends you to read {post.title}'
        message = f'Read "{post.title}" at {post_url}\n\n{cd["name"]}\'s comments {cd["comments"]}'
        send_mail(subject, message, cd["from"], [cd['to']], fail_silently = False)
        sent = cd['to']
        # ... send email
    else:
        sent = False

    return render(request, 'blog/post/share.html', {
        'post': post,
        'sent': sent,
    })

class PostListView(ListView):
    queryset = Post.objects.filter(status = 'published')
    context_object_name = 'posts'
    paginate_by = 3
    template_name = 'blog/post/list.html'

def post_list(request):
    object_list = Post.objects.all()
    paginator = Paginator(object_list, 3) # 3 posts in each page
    page = request.GET.get('page')
    try:
        posts = paginator.page(page)
    except PageNotAnInteger:
        # If page is not an integer deliver the first page
        posts = paginator.page(1)
    except EmptyPage:
        # If page is out of range deliver last page of results
        posts = paginator.page(paginator.num_pages)
    return render(request,'blog/post/list.html',{
        'page': page,
        'page_obj': paginator.page,
        'posts': posts,
    })


def post_detail(request, year, month, day, post):
    post = get_object_or_404(Post,
        slug=post,
        status='published',
        publish__year=year,
        publish__month=month,
        publish__day=day
    )
    comments = post.comments.filter(active = True)

    new_comment = None

    if request.method == 'POST':
        comment = request.POST
        new_comment = Comment(
            post = post,
            name = comment['Name'],
            email = comment['email'],
            body = comment['body']
        )
        new_comment.save()
    request.method = 'GET'
    return render(request,'blog/post/detail.html',{
        'post': post,
        'comments': comments,
        'new_comment': new_comment,
    })

def new_post(request):
    if request.method == 'POST':
        post = request.POST
        new_post = Post(
            title = post['title'],
            slug = post['title'].lower().replace(" ","-"),
            author = User.objects.get(id = 1),
            body = post['body'],
            status = 'published',
        )
        new_post.save()
    return render(request,'blog/post/newpost.html',)
