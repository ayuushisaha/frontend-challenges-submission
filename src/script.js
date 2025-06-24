// List all JSON files for each date here
const jsonFiles = [
    "/challenges/2025-06-28.json",
];

let allEvents = [];

// Social icons Font Awesome classes
const SVGs = {
    github: `<i class="fab fa-github"></i>`,
    linkedin: `<i class="fab fa-linkedin"></i>`, // Corrected icon for LinkedIn
    instagram: `<i class="fab fa-instagram"></i>`
};

// Util: render socials
function renderSocials(socials) {
    if (!socials) return '';
    const links = [
        socials.github ? `<a href="${socials.github}" title="GitHub" target="_blank" rel="noopener" class="flex items-center justify-center w-8 h-8 rounded-full text-[var(--color-primary)] bg-[var(--color-glass-bg)] hover:bg-[var(--color-primary)] hover:text-white transition-colors duration-300 shadow-md">
                            ${SVGs.github}
                          </a>` : '',
        socials.linkedin ? `<a href="${socials.linkedin}" title="LinkedIn" target="_blank" rel="noopener" class="flex items-center justify-center w-8 h-8 rounded-full text-[var(--color-primary)] bg-[var(--color-glass-bg)] hover:bg-[var(--color-primary)] hover:text-white transition-colors duration-300 shadow-md">
                             ${SVGs.linkedin}
                           </a>` : '',
        socials.instagram ? `<a href="${socials.instagram}" title="Instagram" target="_blank" rel="noopener" class="flex items-center justify-center w-8 h-8 rounded-full text-[var(--color-primary)] bg-[var(--color-glass-bg)] hover:bg-[var(--color-primary)] hover:text-white transition-colors duration-300 shadow-md">
                               ${SVGs.instagram}
                             </a>` : ''
    ].filter(Boolean).join('');
    return links ? `<div class="socials flex items-center space-x-2 ml-4">${links}</div>` : '';
}

// Render events to DOM
function renderEvents(events) {
    const eventsDiv = document.getElementById("events");
    eventsDiv.innerHTML = events
        .map(
            (event) => `
            <section class="event-section animate-fade-in">
                <h2 class="text-2xl md:text-3xl font-bold mb-6 text-[var(--color-text-light)] text-center font-space-grotesk">
                    ${event.event}
                    <span class="date text-base md:text-lg text-[var(--color-primary)] bg-[var(--color-glass-bg)] px-3 py-1 rounded-lg ml-3 shadow-sm font-space-grotesk">
                        ${event.date}
                        (${event.projects.length} Submissions)
                    </span>
                    <span class="date text-base md:text-lg text-[#aoaoao] bg-[var(--color-glass-bg)] px-3 py-1 rounded-lg ml-3 shadow-sm font-space-grotesk">
                        (${event.status})
                    </span>
                </h2>
                <div class="projects grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                    ${event.projects
                        .map(
                            (proj) => `
                            <div class="project-card glass p-6 rounded-xl flex flex-col justify-between
                                hover:translate-y-[-8px] hover:shadow-xl transition-all duration-300 font-space-grotesk">
                                <h3 class="text-xl font-bold mb-2 text-[var(--color-primary)] font-space-grotesk">${proj.projectName}</h3>
                                <div class="meta text-sm text-[var(--color-text-muted)] mb-4 leading-relaxed font-space-grotesk">
                                    <div class="mb-1"><strong>Name:</strong> ${proj.studentName}</div>
                                    <div class="mb-1"><strong>Roll No.:</strong> ${proj.rollNo}</div>
                                    <div class="mb-1"><strong>Branch:</strong> ${proj.branch}</div>
                                    <div class="mb-1"><strong>College:</strong> ${proj.college}</div>
                                </div>
                                <div class="card-actions flex items-center justify-between mt-4">
                                    <a href="${proj.liveLink}" class="live-link bg-[var(--color-primary)] text-white px-5 py-2 rounded-lg text-base font-semibold
                                        hover:bg-[var(--color-secondary)] transition-colors duration-300 shadow-lg font-space-grotesk gap-2 flex items-center">
                                        Live Demo <i class="fa fa-external-link" aria-hidden="true"></i>

                                    </a>
                                    ${renderSocials(proj.socials)}
                                </div>
                            </div>
                        `
                        )
                        .join("")}
                    ${event.projects.length === 0 ? `
                        <div class="col-span-full text-center text-[var(--color-text-muted)] py-8 font-space-grotesk">No submissions yet for this event.</div>
                    ` : ''}
                </div>
            </section>
        `
        )
        .join("");
}

// Fetch and setup
Promise.all(
    jsonFiles.map(file => fetch(file).then(res => res.json()))
).then(filesData => {
    allEvents = filesData.flat();
    allEvents.sort((a, b) => b.date.localeCompare(a.date));
    renderEvents(allEvents);
});


// --- Search functionality ---
const searchInput = document.getElementById("search");
searchInput.addEventListener("input", function () {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) {
        renderEvents(allEvents);
        return;
    }
    // filter by projectName, studentName, rollNo, branch, college, event, or socials
    const filtered = allEvents
        .map(event => ({
            ...event,
            projects: event.projects.filter(proj =>
                [
                    event.date,
                    event.event,
                    proj.projectName,
                    proj.studentName,
                    proj.rollNo,
                    proj.branch,
                    proj.college,
                    event.event,
                    ...(proj.socials ? Object.values(proj.socials).map(s => s.toLowerCase()) : []) // Ensure socials are lowercased
                ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()
                .includes(q)
            )
        }))
        .filter(event => event.projects.length > 0);
    renderEvents(filtered);
});

const root = document.documentElement;
root.setAttribute("data-theme", "dark");
