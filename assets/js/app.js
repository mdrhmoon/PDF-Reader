// Declaring of Variables;
let pdfDoc = null,
    pageNum = 1,
    pageIsRendering = false,
    pageNumIsPending = null;

const   scale = 1.5,
        canvas = document.querySelector('#pdf-render'),
        ctx = canvas.getContext('2d'),
        url = './assets/pdf.pdf';


// Render The Page
const renderPage = (num) => {
    pageIsRendering = true;

    //Get Page
    pdfDoc.getPage(num).then(page => {
        // console.log(page);
        const viewport = page.getViewport({ scale: scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: ctx, viewport
        };
        page.render(renderContext).promise.then(() => {
            pageIsRendering = false;

            if(pageNumIsPending !== null){
                renderPage(pageNumIsPending);
                pageNumIsPending = null;
            }
        });

        document.querySelector('#page-num').textContent = num;
    })
};


//Check for pages rendering
const queueRenderPage = (num) => {
    if(pageIsRendering){
        pageNumIsPending = num;
    }else{
        renderPage(num);
    }
};


//Show Previous Page
const showPreviuosPage = () => {
    if(pageNum <= 1){
        return;
    }
    pageNum--;
    queueRenderPage(pageNum);
}


//Show Next Page
const showNextPage = () => {
    if(pageNum >= pdfDoc.numPages){
        return;
    }
    pageNum++;
    queueRenderPage(pageNum);
}


// Get The Document
const loadPdfFile = (filePath) => {
    pdfjsLib.getDocument(filePath).promise.then(doc => {
        pdfDoc = doc;
        
        document.querySelector('#total-page').textContent = pdfDoc.numPages;
        renderPage(pageNum);
    });
}

/*
*   Event Sections
*/
// File SelectEvent
document.querySelector('#pdfFileReader').addEventListener('change', (e) => {
    var path = URL.createObjectURL(e.target.files[0]);
    loadPdfFile(path);
});

//Previous page Event
document.querySelector('#prev-page').addEventListener('click', (e) => {
    showPreviuosPage();
});

//Next page Event
document.querySelector('#next-page').addEventListener('click', (e) => {
    showNextPage();
});