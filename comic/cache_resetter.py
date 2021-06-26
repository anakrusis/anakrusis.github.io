# The purpose of this script is to force everyones browsers to redonload certain files when I run it
# Ngl this script is a little scary LOL (good thing this comic is like thricely backed up on github, the site and here on my hdd)
# - Amimi apr 30 2021

import os
import random

old_js_name = "";
new_js_name = "";

# first pass thru, it finds the current js file with the data and renames it

for root, dirs, files in os.walk("C:\\amimifafa\\comic\\"):
    for file in files:
        if file.endswith(".js") and file.startswith("comicdata"):

            old_js_name = file;
            print("Old .js file: " + old_js_name);

            # the new filename is always appended with a very big random number afterwards

            new_js_name = "comicdata_" + str(random.randint(0,100000000)) + ".js";
            print("New .js file: " + new_js_name);
            
            os.rename(old_js_name, new_js_name);

# second pass thru, it finds all references to that js file in the html and renames them all

for root, dirs, files in os.walk("C:\\amimifafa\\comic\\"):
    for file in files:
        if file.endswith(".html"):

            readfile = open(file, "r")
   
            new_file_content = ""
            
            for line in readfile:
                
                stripped_line = line.strip()
                new_line = "";

                if stripped_line.find("<script src=\"comicdata") != -1:
                    new_line = "<script src=\"" + new_js_name + "\"></script>";

                else:
                    new_line = stripped_line;

                # print(new_line);
                new_file_content += new_line + "\n"
                
            readfile.close()

            writing_file = open(file, "w")
            writing_file.write(new_file_content)
            writing_file.close()
