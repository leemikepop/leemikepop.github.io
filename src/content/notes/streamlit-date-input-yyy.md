---
title: "Streamlit date_input with a three-digit year (YYY/MM/DD)"
date: 2024-04-11
description: Customize the format of Streamlit's date_input to 'YYY/MM/DD' — handy for the Republic of China (Minguo) calendar used in Taiwan.
tags: [Python, Streamlit]
---

Streamlit's `date_input` only accepts a fixed set of date formats. Overriding the regular expression that whitelists those formats lets you use a three-digit year, `YYY/MM/DD`, which also drops the leading zero of the year.

```python
import re

# Make it allows the "YYY/MM/DD" format for the date_input.
from streamlit.elements.widgets import time_widgets
time_widgets.ALLOWED_DATE_FORMATS = re.compile(
    r"^(YYY[/.\-]MM[/.\-]DD|YYYY[/.\-]MM[/.\-]DD|DD[/.\-]MM[/.\-]YYYY|MM[/.\-]DD[/.\-]YYYY)$"
)
```

> This patches a Streamlit internal module, so it may break after upgrading Streamlit.
