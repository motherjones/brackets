## A tool for making interactive March Madness-style brackets

Sample screenshot. 
<p align="center">
  <img src="https://raw.githubusercontent.com/motherjones/map-table/master/img/screenshot.png" alt="screenshot"/>
</p>

##Examples in the wild

[Demo](http://www.motherjones.com/environment/2014/04/auto-bracket-miles-per-gallon)  

##How it works

Each state has a pair of ``_status`` and ``_details`` columns along one or more categories. Change the first word in each of these columns to match the data in your story. Add or delete pairs of columns as needed. Two to four categories tend to work well.

The ``_details`` column contains display copy. These cells can contain regular blurbs, [special characters](http://dev.w3.org/html5/html-author/charref), or be blank. You can use ``<em></em>``, ``<strong></strong>``, ``<a></a>``, and other html tags in these cells for italics, bold, links, and more.

Update the .html, .js, and .css files with your new categories and statuses, and seen in the [Modify](#modify-these-for-your-project) section.

*MoJo staffers:* get started by following [these instructions](https://github.com/motherjones/story-tools#starting-a-new-project). When you're done, upload to s3 and embed in the shell [(how to)](https://github.com/motherjones/story-tools#starting-a-new-project).

##Spreadsheet template

[Here](https://docs.google.com/spreadsheet/ccc?key=0AuHOPshyxQGGdEwxa21COVI3QURwSVFDZ2dBNjFoVHc#gid=0)

*MoJo staffers:* Make a copy and move to the relevant beat folder. Change owner to MoJo Data in ``Share > Advanced``

##Modify these for your project
**In index.html:**

            <li class="key-item key-0"><b></b><span>Restrictions passed</span></li>
            <li class="key-item key-1"><b></b><span>New restrictions passed but challenged in court</span></li>
            <li class="key-item key-2"><b></b><span>No change</span></li>

and every instance of:

        <th><h6>Specific information or criteria required of minors</h6>
        ...
        <svg id="provide_map" ...


**In script.js:**

        //make cells and map for each category
        $tr.append(makeCell(row, 'providestatus', 'providedetails', 'provide_map'));
        $tr.append(makeCell(row, 'evidencestatus', 'evidencedetails', 'evidence_map'));
        $tr.append(makeCell(row, 'judgesstatus', 'judgesdetails', 'judges_map'));
        $tr.append(makeCell(row, 'fewerstatus', 'fewerdetails', 'fewer_map'));
        $tr.append(makeCell(row, 'lawyersstatus', 'lawyersdetails', 'lawyers_map'));

**In style.css**:

Everywhere a status is mentioned, eg.:

    .key-0 b, .yes, svg .yes path, .yes, svg path.yes ...
