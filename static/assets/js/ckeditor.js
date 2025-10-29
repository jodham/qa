    $(document).ready(function(){
    // This sample still does not showcase all CKEditor&nbsp;5 features (!)
    // Visit https://ckeditor.com/docs/ckeditor5/latest/features/index.html to browse all the features.
    ClassicEditor
            .create( document.querySelector( '#ckeditor' ) )
            .catch( error => {
                console.error( error );
            } );
    });

    $(document).ready(function () {
        const editors = ['#activity', '#committee'];
        const editorInstances = {};
    
        const createEditor = (selector) => {
            ClassicEditor
                .create(document.querySelector(selector))
                .then(editor => {
                    editorInstances[selector] = editor;
                })
                .catch(error => {
                    console.error(`Error initializing ${selector}:`, error);
                });
        };
    
        editors.forEach(createEditor);
    
        $('#event').on('submit', function (e) {
            let isValid = true;
    
            editors.forEach(selector => {
                const editor = editorInstances[selector];
                const textarea = document.querySelector(selector);
                const content = editor.getData().trim();
    
                // Update textarea with editor content
                textarea.value = content;
    
                // Manual validation for required fields
                if (textarea.hasAttribute('required') && !content) {
                    isValid = false;
                    alert(`The field ${selector.replace('#', '')} is required.`);
                }
            });
    
            if (!isValid) {
                e.preventDefault();
            }
        });
    });
    
    