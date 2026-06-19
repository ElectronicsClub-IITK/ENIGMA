Through the developed code base, currently you have an encrypted output corresponding to the input you enter. The task is to display this output on a 16x2 lcd display using serial communication between python & arduino ides. 

Modify the current codebase to add this block for communication ( and its corresponding display code in arduino ). You will be testing out this code in the deliverable.

Now for the part where I expect you'll come up with some creative : As we discovered yesterday, both vs code and serial monitor cannot access the serial port at the same time. However as malfunctioning hardwares are a very common occurence, we need to have some kind of warning/confirmation for a situation where the information did reach arduino ide, but the 16x2 lcd display is betraying us :)
Think of what safety measure you can apply, and integrate it in your code. Once more, you'll be testing these out later.

Deadline : Saturday, 31 May eod
