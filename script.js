document.addEventListener("DOMContentLoaded", function () {

    // Function to switch active class for menu items
    [...document.querySelectorAll(".menu-item")].forEach(button => {
        button.addEventListener("click", function () {
            // Remove active class from the previous button
            document.querySelector(".menu-item.active-btn")?.classList.remove("active-btn");

            // Add active class to the clicked button
            this.classList.add("active-btn");

            // Remove active class from the previous content
            document.querySelector(".active")?.classList.remove("active");

            // Add active class to the corresponding content section
            const contentId = button.dataset.id;
            document.getElementById(contentId)?.classList.add("active");
            
            setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 50); //site is just one page with different sections, need to scroll to top
        });
    });

    // Toggle theme on button click
    document.querySelector(".theme-btn").addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
    });

    // Text analysis logic
    const textBox = document.getElementById("inputText");
    const outputDiv = document.getElementById("output");

    const pronouns = [
        "i", "you", "he", "she", "it", "we", "they", "me", "him", "her", "us", "them", "my", 
        "your", "his", "her", "its", "our", "their", "mine", "yours", "hers", "ours", "theirs",
        "who", "whom", "whose", "this", "that", "these", "those", "what", "which", "whoever", 
        "whomever", "anyone", "anybody", "everyone", "everybody", "someone", "somebody", "no one",
        "nobody", "nothing", "anything", "everything", "each", "another", "any", "some", "one"
    ];  
    const prepositions = [
        "about", "above", "across", "after", "against", "along", "among", "around", "as", "at",
        "before", "behind", "below", "beneath", "beside", "between", "beyond", "by", "despite", "down",
        "during", "except", "for", "from", "in", "inside", "into", "like", "near", "of", "off",
        "on", "onto", "out", "outside", "over", "past", "regarding", "since", "through", "throughout", "to",
        "toward", "under", "underneath", "until", "up", "upon", "with", "within", "without"
    ];  
    const indefiniteArticles = ["a", "an"];

    // Analyze the text when the button is clicked
    document.getElementById("analyzeButton").addEventListener("click", () => {
        const text = textBox.value;
        const stats = analyzeTextLogic(text);
        displayStats(stats);
    });

    // Analyze the text
    function analyzeTextLogic(text) {
        const stats = {
            letters: 0,
            words: 0,
            spaces: 0,
            newlines: 0,
            specialSymbols: 0,
            pronouns: {},
            prepositions: {},
            indefiniteArticles: {}
        };

        const words = text.split(/\s+/);

        // Count letters, spaces, newlines, and special symbols
        for (let char of text) {
            if (/[a-zA-Z]/.test(char)) {
                stats.letters++;
            } else if (char === " ") {
                stats.spaces++;
            } else if (char === "\n") {
                stats.newlines++;
            } else if (/[^\w\s]/.test(char)) {
                stats.specialSymbols++;
            }
        }

        // Count words
        stats.words = text.trim() === "" ? 0 : words.length;

        // Tokenize text and count pronouns, prepositions, and indefinite articles
        words.forEach(word => {
            const lowerWord = word.toLowerCase();

            // Count pronouns
            if (pronouns.includes(lowerWord)) {
                stats.pronouns[lowerWord] = (stats.pronouns[lowerWord] || 0) + 1;
            }

            // Count prepositions
            if (prepositions.includes(lowerWord)) {
                stats.prepositions[lowerWord] = (stats.prepositions[lowerWord] || 0) + 1;
            }

            // Count indefinite articles
            if (indefiniteArticles.includes(lowerWord)) {
                stats.indefiniteArticles[lowerWord] = (stats.indefiniteArticles[lowerWord] || 0) + 1;
            }
        });

        return stats;
    }

    // Display the stats
    function displayStats(stats) {
        outputDiv.innerHTML = `
            <h3>Text Analysis:</h3>
            <p><strong>Letters:</strong> ${stats.letters}</p>
            <p><strong>Words:</strong> ${stats.words}</p>
            <p><strong>Spaces:</strong> ${stats.spaces}</p>
            <p><strong>Newlines:</strong> ${stats.newlines}</p>
            <p><strong>Special Symbols:</strong> ${stats.specialSymbols}</p>
            <p><br></br></p>

            <h3>Pronouns:</h3>
            <ul>${Object.entries(stats.pronouns).map(([pronoun, count]) => `<li>${pronoun}: ${count}</li>`).join("")}</ul>
            <p><br></br></p>

            <h3>Prepositions:</h3>
            <ul>${Object.entries(stats.prepositions).map(([prep, count]) => `<li>${prep}: ${count}</li>`).join("")}</ul>
            <p><br></br></p>

            <h3>Indefinite Articles:</h3>
            <ul>${Object.entries(stats.indefiniteArticles).map(([article, count]) => `<li>${article}: ${count}</li>`).join("")}</ul>
            <p><br></br></p>
        `;
    }

    function getElementType(element) {
        if (element.tagName === "IMG") return "image";
        if (element.tagName === "SELECT") return "drop-down";
        if (element.tagName === "P" || element.tagName === "SPAN" || element.tagName === "DIV") return "text";
        if (element.tagName === "A") return "link";
        if (element.tagName === "BUTTON") return "button";
        if (element.tagName === "INPUT") return `${element.type} input`;
        return element.tagName.toLowerCase(); // fallback
    }

    // Function to log events
    function logEvent(type, element) {
        const timestamp = new Date().toISOString();
        const elementType = getElementType(element);
        console.log(`${timestamp} , ${type} , ${elementType}`);
    }

    // Log all click events
    document.addEventListener("click", (e) => {
        logEvent("click", e.target);
    });

    // Log "views" for elements currently visible on load
    const allElements = document.querySelectorAll("img, select, p, span, div, a, button, input, h1, h2, h3, h4, h5, h6");
    allElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
        if (isVisible) {
            logEvent("view", el);
        }
    });
});
