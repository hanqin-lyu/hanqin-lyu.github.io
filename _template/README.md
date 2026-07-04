# How to add a new project

1. Copy this entire `_template/` folder and rename the copy to new project's
   slug, e.g. `projects/new-project/`. Keep the `images/` and `docs/`
   subfolders — they're there for when you have screenshots or supporting
   files to attach.

2. Open the new folder's `index.html` and replace every placeholder:
   - `PROJECT TITLE`, `CATEGORY`, the eyebrow label, the lede sentence
   - The badge row (tech names)
   - Situation / Task / Action / Result sections
   - The metrics table, tech stack table, and architecture diagram
   - The "Related project" link at the bottom — point it at whichever
     existing project folder makes sense, e.g. `../shift-left-devsecops/`

3. Put any screenshots in this project's own `images/` folder and reference
   them with a relative path, e.g. `<img src="images/my-screenshot.png">`
   (no `../` needed — same folder as the HTML file).

4. Put any supporting files (PDFs, exported reports, etc.) in `docs/` the
   same way: `<a href="docs/my-report.pdf">`.

5. Go to the homepage `index.html` (root of the site) and add a new project
   card in the `card-grid`, copying the structure of an existing card:

   ```html
   <a class="project-card" href="projects/new-project/" style="display:block; color:inherit;">
     <div class="card-top">
       <h3>New Project Title</h3>
       <span class="status-pill">ACTIVE</span>
     </div>
     <p>Few words for summary.</p>
     <div class="tag-row">
       <span class="tag">Tech 1</span>
       <span class="tag">Tech 2</span>
     </div>
     <span class="card-link">View details →</span>
   </a>
   ```

6. If you want the new project to also appear as a "Related project" link on
   an existing page, add it there of other project.

That's it — no changes to `style.css` are needed for a new project unless
you're introducing a new visual pattern.
