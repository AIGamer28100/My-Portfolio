# My Portfolio Website

This my personal portfolio is build using Django and delpoyed in [pythonanywhere.com](https://www.pythonanywhere.com/)

You can access my portfolio at [aigamer.pythonanywhere.com](https://aigamer.pythonanywhere.com/)

This also conatin other Django Projects that I have built, which is can be found [here](https://aigamer.pythonanywhere.com/#projects) and also listed below - 

- [Movie Lens Dataset](https://aigamer28100.github.io/Movie-Lens-Dataset-Visualization-and-Prediction/)  - Visualisation and Predictions
- [Google Serach](https://aigamer28100.github.io/Google-Search/) - Google Search Page recreated using HTML and CSS.
- [The Encyclopedia](https://aigamer.pythonanywhere.com/encyclopedia/) - My version of Wikipedia recreated using Django
- [E-Commerce](https://aigamer.pythonanywhere.com/auctions/) - eBay like E-Commerce Autions Site using Django Framework
- [Blog Post](https://aigamer.pythonanywhere.com/blog/) - A basic Blog posting site using Django
- [E-Shopping](https://aigamer.pythonanywhere.com/ecart/) - Amazon, Flipkart like cloud shopping platform
- [Social Distaning Enforcement System (SDES)](https://github.com/AIGamer28100/Social-Distance-Detection-using-OpenCV)
- [HMAIL](https://aigamer.pythonanywhere.com/hmail/) - E-Mailing System
- [Verzeo Internship Project](https://github.com/AIGamer28100/Verzeo-Internship)
- [OCR](https://github.com/AIGamer28100/Design-Project-II) - An Offline Handwritten Text Segmentation and Recognition System with TensorFlow
- [A Basic ToDo App](https://aigamer.pythonanywhere.com/todo/)
- [E-YOLO (Enhanced YOLO)](https://github.com/HariHaran-S-HITS/E-YOLO) - This is a proof of concept code base used for a conference paper - Link to Conference [Paper](https://ieeexplore.ieee.org/document/9885410)

> For testing you can use the below user credentional in case of login required
> 
> **Username** : Demo
> 
> **Email Id** : demo@email.com
> 
> **Password** : demo@123



## Utils

I have also created a python script to delpoy and reload the application in pythonanywhere

> **NOTE**: Run the script after pushing the code to your git repository

#### Prerequisite

- Account in [pythonanywhere.com](https://www.pythonanywhere.com)
- Create a API token from settings
- Project already setup in pythonanywhere and deloyed manually atleast once

Now Run [deploy.py](deploy.py) script using the below code
```
python deploy.py -u <username> -a <api_token> -d <domain> -w <absolute_path_to_git_directory_in_pythonanywhere>
```
