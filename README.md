# Project Name - Real-Time User Interaction App

# 1. What the Project Is About

This project is a web application inspired by platforms like Pinterest.
It focuses on displaying large collections of high-quality images and allows users to interact in real time through likes and comments.
All images are fetched from the Unsplash API and rendered on-demand based on the user’s search queries.

# 2. Tech Stack Used

React.js — Frontend UI

InstantDB — Handles real-time interactions (likes + comments)

Unsplash API — Image data

Local Storage — For generating and storing unique user IDs

# 3. Key Features (Explained Naturally)
🔍 Image Search

At the top, there is a search bar where users can type what kind of images they want (e.g., “Nature”, “Cars”, “Mountains”).
The app then calls Unsplash API and updates the feed instantly.

# ♾ Infinite Scroll

There is no pagination button.
Images keep loading as the user scrolls down, giving a smooth and modern browsing experience.

# ❤️ Real-Time Like System

Users can like any image:

The total like count updates in real time for all connected users.

The like button is visually highlighted only for the user who liked it.

No sign-in required — a unique user ID is auto-generated and stored locally.

# 💬 Real-Time Comments

Each image shows how many comments it has.
Clicking the comment button opens a dedicated page where the user can:

View the image in high resolution

Download the image

Add comments in real time

See comments appear instantly for everyone

Every comment: Belongs to the user who wrote it

Has a delete button visible only to that same user

# 👤 Unique User Identity

To avoid logins, the app creates a unique ID for every visitor using local storage.
This ID is used to handle permissions for deleting comments or marking likes.

# 4. Why This Project Matters

This application demonstrates:

Real-time data synchronization between multiple users

Design patterns used in modern social platforms

Clean UI/UX with infinite scroll and interactive components

Smooth integration between third-party APIs + real-time DB

It’s more than just an image gallery — it’s a working example of collaborative, real-time user interactions without any authentication system.

# 5. User Flow Summary

User opens the homepage

Images load automatically using infinite scroll

User can search for specific image categories

User can like or comment on images

Likes + comments update instantly for everyone

Clicking comment takes user to a detailed page with full resolution + download button

User can delete only their own comments

# 7. Final Notes

If you're still reading then i wanna tell you that.....

This project was a really goood experience for me. And to be honest, " InstantDB ".... i've never heard of this platform before and 
i didn't find any proper resources to learn this thing so most of the work of this project was done with the help of GPT, but the logics and concepts 
were clear to me and that is what matters to me.

And Please Tell me what you think about this project
