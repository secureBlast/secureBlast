from django.shortcuts import render, redirect
from django.http import JsonResponse, Http404
from django.core.exceptions import ValidationError
from .models import Message, Room, Active
import json, codecs
from authentication_api.models import NewUser
from .forms import MessageForm, RoomCreationForm, RoomJoinForm

# import functions related to AES-256-GCM + Scrypt encryption
from .encryption import encrypt_AES_GCM, decrypt_AES_GCM, get_encryption_key, decrypt


# this function handles the chat room creation functionality
def room_create_view(request, *args, **kwarsg):
    user = request.user
    form = RoomCreationForm()
    if request.POST:
        form = RoomCreationForm(request.POST or None)
        if form.is_valid():
            obj = form.save(commit=False)
            room_name = form.cleaned_data.get("room_name")
            code = form.cleaned_data.get("code")
            obj.room_name = room_name
            obj.code = code
            room = Room.objects.create(
                room_name=room_name,
                code=code,
            )
            room.owner.add(user)
            form = RoomCreationForm()
            print(room)
            return JsonResponse(room.serialize(user), status=201)
    if form.errors:
        print(form.errors)
        return JsonResponse(form.errors, status=400)
    return render(request, "room_create_form.html",  {"form": form})


# this function handles the room message creation functionality
def message_create_view(request, room_code, *args, **kwarsg):
    if not request.user.is_authenticated:
        return redirect("/accounts/login?next=/profiles/users/update")
    user = request.user
    profile = user.profile
    profile_data = {
        "first_name": user.first_name,
        "last_name": user.last_name
    }
    qs = Room.objects.filter(code=room_code)
    if not qs.exists():
        raise Http404
    room_obj = qs.first()
    form = MessageForm()
    if request.POST:
        form = MessageForm(request.POST or None)
        if form.is_valid():
            obj = form.save(commit=False)
            value = form.cleaned_data.get("value")
            try:
                encryptetMsg = encrypt_AES_GCM(value, get_encryption_key())
                if "gAAAAAB" in encryptetMsg:
                    print(encryptetMsg)
                    obj.value = encryptetMsg
                else:
                    a = encryptetMsg[0]
                    b = encryptetMsg[1]
                    c = encryptetMsg[2]
                    print(encryptetMsg)
                    obj.value = encryptetMsg
                    obj.val1 = a
                    obj.val2 = b
                    obj.val3 = c
                
            except:
                print("An exception occurred")
                obj.value = value
            # obj.value = value
            obj.user = user
            obj.room = room_obj
            obj.save()
            form = MessageForm()
    return render(request, "message_form.html",  {"form": form})



# this function returns the user room list to a hidden url
# then fetch in front-end to setup profile image
def room_list_view(request, *args, **kwargs):
    rooms = []
    room_list = Room.objects.filter(owner=request.user)
    qs = Room.objects.all()
    room1 = qs.first()
    # print(room1.owner.all())
    for room in room_list:
        temp = room.serialize(request.user)
        rooms.append(temp)
    context = {
        "room_list": rooms,
    }
    return JsonResponse(context, status=200)



# this function handles the chat room join functionality
def room_join_view(request, *args, **kwarsg):
    extracted_messages = []
    is_member = False
    user = request.user
    form = RoomJoinForm()
    if request.POST:
        form = RoomJoinForm(request.POST or None)
        if form.is_valid():
            room_name = form.cleaned_data.get("room_name")
            code = form.cleaned_data.get("code")
            print(room_name + " " + code)
            room = Room.objects.filter(code = code)
            room = room.first()
            if room:
                actives = Active.objects.filter(active_users = user)
                actives = actives.first()
                print(actives)
                if actives:
                    actives.delete()
                obj_active = Active(room=room, active_users=user)
                obj_active.save()
                members = room.owner.all()
                for member in members:
                    if member.email == user.email:
                        is_member = True
                if is_member:
                    print("is a member")
                    room_messages = Message.objects.filter(room = room)
                    print(room_messages)
                    for msg in room_messages:
                        temp = msg.serialize()
                        extracted_messages.append(temp)
                    context = {
                        "msg_list": extracted_messages,
                        "current_user" :  user.email,
                    }
                    return JsonResponse(context, status=200)
                else :
                    print("not a member")
                    room.owner.add(user)
                    room_messages = Message.objects.filter(room = room)
                    print(room_messages)
                    for msg in room_messages:
                        temp = msg.serialize()
                        extracted_messages.append(temp)
                    context = {
                        "msg_list": extracted_messages,
                        "current_user" : user.email,
                    }
                    return JsonResponse(context, status=200)
            else :
                print("Room not exist")
                raise ValidationError("Room does not exist!")
            form = RoomJoinForm()
    if form.errors:
        print(form.errors)
        return JsonResponse(form.errors, status=400)
    return render(request, "room_join_form.html",  {"form": form})


# returns all the messages of currently active room
def message_list_view(request, *args, **kwargs):
    messages = []
    actives = Active.objects.filter(active_users = request.user)
    actives = actives.first()
    if actives:
        msg_list = Message.objects.filter(room=actives.room)
        for msg in msg_list:
            temp = msg.serialize()
            test = temp['message']
            if "gAAAAAB" in test:
                x = decrypt_AES_GCM(test, get_encryption_key())
                temp['message'] = x
            else:
                test = test[1:]
                test = test[:-1]
                print(test)
                print(test.replace(" ", ""))
                test_list = test.split(",")
                print(test_list)
                tuple_data = [test_list[0][1:][:-1], test_list[1][1:][:-1], test_list[2][1:][:-1]]
                print(tuple(test_list))
                print(decrypt(temp['val1'], temp['val2'], temp['val3'], get_encryption_key()))
                temp['message'] = decrypt(temp['val1'], temp['val2'], temp['val3'], get_encryption_key()).decode('utf-8')
            messages.append(temp)
    context = {
        "messages_list": messages,
        "current_user" : request.user.email,
        "room_name" : actives.room.room_name,
        "room_code" : actives.room.code,
    }
    return JsonResponse(context, status=200)

