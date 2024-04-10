---
layout: post
title:  "Customize the format of the Streamlit date_input to 'YYY/MM/DD' with three digits for the year."
date:   2024-04-11 01:10:59 +0800
categories: jekyll update
---
This removes the leading zero of year.
~~~python
# Make it allows the "YYY/MM/DD" format for the date_input.
from streamlit.elements.widgets import time_widgets
time_widgets.ALLOWED_DATE_FORMATS = re.compile(
    r"^(YYY[/.\-]MM[/.\-]DD|YYYY[/.\-]MM[/.\-]DD|DD[/.\-]MM[/.\-]YYYY|MM[/.\-]DD[/.\-]YYYY)$"
)
~~~
