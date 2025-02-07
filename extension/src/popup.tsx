import screenshot from "data-base64:/assets/screenshot.png"

function IndexPopup() {
    return (
        <div
            style={{
                padding: 16,
                width: 300
            }}
        >
            <h2>Slickdeals Summarizer</h2>
            <p>Navigate to a Slickdeals thread to use the summarizer, look for this button</p>
            <img src={screenshot} alt='button screenshot' width={280}/>

        </div>
    )
}

export default IndexPopup
