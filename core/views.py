from django.shortcuts import render

# Create your views here.


def index(request):
    return render(request, 'core/index.html')

def payments(request):
    return render(request, 'payments.html')


def about(request):
    return render(request, 'about.html')