function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

var blog_id = "7560924667308743912";

var calendar_id = "6072fah5roc9ar6rbcg8n9vs60@group.calendar.google.com";

var calendarUrl = "https://www.googleapis.com/calendar/v3/calendars/" + calendar_id +"/events?maxResults=6&key=" + findGetParameter("stuff");

var postsUrl = "https://www.googleapis.com/blogger/v3/blogs/" + blog_id +"/posts?key=" + findGetParameter("stuff");
var pagesUrl = "https://www.googleapis.com/blogger/v3/blogs/" + blog_id +"/pages?key=" + findGetParameter("stuff");

jQuery(document).ready(function($){
    $.get(pagesUrl, function(data) {
        var pages = data["items"];
        for (var i=0; i < pages.length; i++) {
            var page = pages[i].content;
            if($(page).find("img").attr("src") != "" &&
            $(page).find("img").attr("src") != undefined &&
            $(page).find("img").attr("src") != null) {
                var testimonialItem = $("<div/>", {
                    class: "item"
                });
                var testimonialItemWrapper = $("<div/>", {
                    class: "testimonials-item"
                });

                var img = $("<img/>", {
                    src: $(page).find("img").attr("src"),
                });
                $(testimonialItemWrapper).append(img);

                var content = "";
                for(var j = 0; j < $(entry.content).filter("p").length; j++) {
                    var paragraph = $(entry.content).filter("p")[j];
                    if(paragraph.innerHTML != "" && paragraph.innerHTML != "<br>") {
                        if(content == "") {
                            content += "<p>";
                        } else {
                            content += "</br>";
                        }
                        content += paragraph.innerHTML;
                    }
                }

                if(content != "") {
                    $(testimonialItemWrapper).append(content);
                }
                $(testimonialItem).append(testimonialItemWrapper);

                $("#owl-testimonials").append(testimonialItem);
            }
        }

        var owl = $("#owl-testimonials");
        owl.owlCarousel({
            pagination : true,
            paginationNumbers: false,
            autoPlay: 6000, //Set AutoPlay to 3 seconds
            items : 1, //10 items above 1000px browser width
            itemsDesktop : [1000,1], //5 items between 1000px and 901px
            itemsDesktopSmall : [900,1], // betweem 900px and 601px
            itemsTablet: [600,1], //2 items between 600 and 0
            itemsMobile : false // itemsMobile disabled - inherit from itemsTablet option
        });
    });

    $.get(postsUrl, function(data) {
        var elements = data["items"];
        for(var i = 0; i < elements.length; i++) {
            var entry = elements[i];
            //console.log(entry);
            var content = "";
            var imgsrc = "img/blog_item_bg.jpg";
            if($(entry.content).find("img").attr("src") != ""
                && $(entry.content).find("img").attr("src") != undefined
                && $(entry.content).find("img").attr("src") != null) {
                imgsrc = $(entry.content).find("img").attr("src");
            }
            for(var j = 0; j < $(entry.content).filter("p").length; j++) {
                var paragraph = $(entry.content).filter("p")[j];
                if(paragraph.innerHTML != "" && paragraph.innerHTML != "<br>") {
                    if(content == "") {
                        content += "<p>";
                    } else {
                        content += "</br>";
                    }
                    content += paragraph.innerHTML;
                }
            }
            if(content != "") {
                content += "</p>";
            }
            var tab = $("<div/>", {
                id: "tab" + (i+1)
             });

            var img = $("<img/>", {
                src: imgsrc,
                alt: ""
            });

            var textContent = $("<div/>", {
                class: "text-content"
            });

            var subtitle = $("<span/>");
            var year = entry.published.substr(0, 4);
            var month = entry.published.substr(5,2);
            var day = entry.published.substr(8,2);
            $(subtitle).append(day + ". " + getMonthByNumber(month) + " " + year);

            $(textContent).append("<h4>" + entry.title +"</h4>");
            $(textContent).append(subtitle);
            $(textContent).append(content);

            $(tab).append(img);
            $(tab).append(textContent);

            $("#first-tab-group").append(tab);
            $("#tab_link_" + (i+1)).text(entry.title);
            if(i + 1 == 4) {
                break;
            }
         }
         $('.tabgroup > div').hide();
         $('.tabgroup > div:first-of-type').show();
    });

    var date = new Date();
    var formatted = date.toISOString();

    $.get(calendarUrl + "&timeMin=" + formatted, function(data) {
        var items = data["items"];
        for(var i = 0; i < items.length; i++) {
            var calendarEntry = items[i];
            console.log(calendarEntry);

            var entryBox = $("<div />", {
                class: "col-md-6 col-sm-6 project-item mix mix_all"
            });

            var innerBox = $("<div />", {
                class: "innerBox"
            });
            $(entryBox).append(innerBox);

            $(entryBox).addClass(calendarEntry.description);

            $(innerBox).append("<h3>" + calendarEntry.summary + "</h3>");

            if(calendarEntry.start.dateTime != undefined) {
                var year = calendarEntry.start.dateTime.substr(0, 4);
                var month = calendarEntry.start.dateTime.substr(5, 2);
                var day = calendarEntry.start.dateTime.substr(8, 2);
                var time = calendarEntry.start.dateTime.substr(11, 5);
                $(innerBox).append("<h5>" + day + ". " + getMonthByNumber(month) + " " + year + "</h5>");
                $(innerBox).append("<h6>" + time + " bis " + calendarEntry.end.dateTime.substr(11,5) + "</h6>");
            } else {
                var yearComplete = calendarEntry.start.date.substr(0, 4);
                var monthComplete = calendarEntry.start.date.substr(5, 2);
                var dayComplete = calendarEntry.start.date.substr(8, 2);
                $(innerBox).append("<h5>" + dayComplete + ". " + getMonthByNumber(monthComplete) + " " + yearComplete + "</h5>");
            }

            if(calendarEntry.location != undefined) {
                $(innerBox).append("<h6>Ort: " + calendarEntry.location + "</h6>");
            }

            $(".projects-holder-3 .projects-holder>.row").append(entryBox);
            $(entryBox).css("display", "block");

            //classes:
            // sonstiges: misc
            // Spieltag: gameday
            // Training: training
        }
        /************** Mixitup (Filter Projects) *********************/
        $('.projects-holder').mixitup({
            effects: ['fade','grayscale'],
            easing: 'snap',
            transitionSpeed: 400
        });
    });
});

function getMonthByNumber(number) {
    switch(number) {
        case "01":
            return "Januar";
        case "02":
            return "Februar";
        case "03":
            return "März";
        case "04":
            return "April";
        case "05":
            return "Mai";
        case "06":
            return "Juni";
        case "07":
            return "Juli";
        case "08":
            return "August";
        case "09":
            return "September";
        case "10":
            return "Oktober";
        case "11":
            return "November";
        case "12":
            return "Dezember";
        default:
            return number;
    }
}
