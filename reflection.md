# Major Project Reflection

## What advice would I give to myself if I was to start a project like this again?
- At the start of the project I wasted a lot of time trying to improve the game I made for my grid assignment only to delete all of the code a few weeks after. I would've adviced myself to start a brand new project instead of trying to improve an old one because I think that was a lot easier and also was pretty fun. 
- Do not make a main menu before finishing the first level. Even though clicking play only takes a few seconds of my time I still felt that I should've made the menu after I was completely done with my first level because having to go through the menu everytime I want to fix a bug or to see if the code works was a bit tedious.
- Don't overcomplicate things. I usually try to overcomplicate things with unnecessary functions like map() and it was just making the code more complex to look at. Sometimes it's the simple things that work.

## Did I complete everything in my "needs to have" list?
- Yes, I managed to complete everything in my "needs to have" list.
- I also managed to complete one part of my "nice to have" list which was to add a progress bar to the levels.

## What was the hardest part of the project?
- The hardest part was doing the animations for pretty much everything in the game. There was a lot of timing that I had to do and I had to use a lot of setTimeout() functions as well. 
- Coding the player movement and the borders also took a while to do. Originally I thought that detecting player collisions with the death blocks would be difficult but thankfully collide2d library made it really easy. 
- Not the hardest, but the most tedious/annoying part was getting the timing right for the music and the attack patterns; But in the end I think I'm happy with how it turned out. 

## Were there any problems you could not solve?
- The hourglass on top of the player only shows up when the player has i-frames and after the i-frames expire it disappears.
- Originally I wanted the hourglass to turn 180 degrees before disappearing but the p5.js rotate function was way too complex to make this happen. 
- Sometimes it misplaced the hourglass and sometimes it didn't rotate at all. Eventually I had to give up on this idea. 
- I also wanted the squares to rotate as well but this was even harder to do because collide2d (I'm pretty sure) wasn't able detect accurate collisions if the object was rotated.