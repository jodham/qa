from django import forms
from django.contrib.auth.models import User
from .models import Profile  # the model that has phone and address


class UserForm(forms.ModelForm):
    confirm_password = forms.CharField(
        widget=forms.PasswordInput(),
        label="Confirm password"
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name']
        widgets = {
            'password': forms.PasswordInput(),
            'email': forms.EmailInput(attrs={'placeholder': 'Enter your email'}),
            'first_name': forms.TextInput(attrs={'placeholder': 'Enter your first name'}),
            'last_name': forms.TextInput(attrs={'placeholder': 'Enter your last name'}),
            'username': forms.TextInput(attrs={'placeholder': 'Choose a username'}),
        }

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get("password")
        confirm_password = cleaned_data.get("confirm_password")

        if password and confirm_password and password != confirm_password:
            self.add_error("confirm_password", "Passwords do not match.")

        return cleaned_data


class ProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ['phone', 'address']
        widgets = {
            'phone': forms.TextInput(attrs={'placeholder': 'Enter your phone number'}),
            'address': forms.Textarea(attrs={'placeholder': 'Enter your address'}),
        }
