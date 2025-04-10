import PyPDF2
from g4f.client import Client

def extract_text_from_pdf(file):
    """
    Extracts text from an uploaded PDF file.
    """
    text = ""
    try:
        reader = PyPDF2.PdfReader(file)
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    except Exception as e:
        print(f"Error extracting text: {e}")
    return text

def extract_text_from_pdfs(files):
    """
    Extracts and combines text from multiple PDF files.
    """
    combined_text = ""
    for file in files:
        combined_text += extract_text_from_pdf(file) + "\n"
    return combined_text

def check_plagiarism(text, custom_instructions=""):
    """
    Uses an AI model to analyze the provided text for plagiarism.
    Returns a detailed report that includes a plagiarism score,
    identified problematic sections, and rephrasing suggestions.
    """
    client = Client()
    system_message = (
        "You are a plagiarism detection assistant. Analyze the provided text from an academic document "
        "and check for potential plagiarism. Provide a plagiarism score between 0 and 100. Identify sections "
        "that seem to be copied or lack originality, and then offer suggestions for improvement, including "
        "examples on how the text could be rephrased for better originality. "
    )
    if custom_instructions:
        system_message += custom_instructions

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": f"Please analyze the following text for plagiarism:\n\n{text}"}
        ],
        web_search=True
    )
    return response.choices[0].message.content

def summarize_text(text):
    """
    Uses an AI model to generate a concise summary of the provided text.
    """
    client = Client()
    system_message = (
        "You are a helpful assistant that summarizes academic text concisely. "
        "Provide a clear and brief summary of the text."
    )
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": f"Summarize the following text:\n\n{text}"}
        ],
        web_search=True
    )
    return response.choices[0].message.content

def highlight_plagiarized_sections(analysis, original_text):
    """
    A placeholder function that highlights sections of the original text
    based on the analysis output. In a full implementation, you would parse
    the analysis for specific markers and highlight only those sections.
    """
    highlighted = original_text
    if "copied" in analysis.lower() or "lack originality" in analysis.lower():
        highlighted = f"<mark>{original_text}</mark>"
    return highlighted

def main():
    # --- Sidebar Dark Mode Toggle & Tooltips ---
    dark_mode = False  # No UI to toggle dark mode

    # --- Inject CSS based on dark mode ---
    if dark_mode:
        print("Dark mode enabled")
    else:
        print("Light mode enabled")

    # --- Header Banner ---
    print("Enhanced AI Plagiarism Checker")
    print("Experience a sleek, intuitive interface with advanced design features.")

    # --- Sidebar: Settings & Options (with Tooltips) ---
    custom_instructions = "Provide detailed analysis and rephrasing suggestions."
    sensitivity = 50
    custom_instructions += f"\nAnalyze with a sensitivity threshold of {sensitivity}."
    summarize_option = False

    reports = []

    # --- Tabs for Input Methods ---
    print("Choose an input method:")
    print("1. Upload PDF Files")
    print("2. Enter Text Directly")
    print("3. Compare Documents")
    choice = input("Enter your choice (1/2/3): ")

    if choice == "1":
        print("Upload PDF Files")
        file_paths = input("Enter the paths of the PDF files separated by commas: ").split(",")
        text = ""
        if file_paths:
            print("Extracting text from PDF(s)...")
            if len(file_paths) == 1:
                with open(file_paths[0], "rb") as file:
                    text = extract_text_from_pdf(file)
            else:
                for file_path in file_paths:
                    with open(file_path, "rb") as file:
                        text += extract_text_from_pdf(file) + "\n"
            if text:
                print("Text extracted successfully!")
                print("Extracted Text:")
                print(text)
                with open("extracted_text.txt", "w") as f:
                    f.write(text)
                print("Text saved to extracted_text.txt")
        if text and input("Check for Plagiarism? (yes/no): ").lower() == "yes":
            print("Analyzing text for plagiarism...")
            result = check_plagiarism(text, custom_instructions)
            print("Plagiarism Check Result:")
            print(result)
            reports.append(result)
            highlighted_text = highlight_plagiarized_sections(result, text)
            print("Highlighted Potentially Plagiarized Sections:")
            print(highlighted_text)
            if summarize_option:
                print("Generating summary...")
                summary = summarize_text(text)
                print("Document Summary:")
                print(summary)
            with open("plagiarism_report.txt", "w") as f:
                f.write(result)
            print("Report saved to plagiarism_report.txt")

    elif choice == "2":
        print("Enter Text Directly")
        text = input("Enter your text below:\n")
        if text and input("Check for Plagiarism? (yes/no): ").lower() == "yes":
            print("Analyzing text for plagiarism...")
            result = check_plagiarism(text, custom_instructions)
            print("Plagiarism Check Result:")
            print(result)
            reports.append(result)
            highlighted_text = highlight_plagiarized_sections(result, text)
            print("Highlighted Potentially Plagiarized Sections:")
            print(highlighted_text)
            if summarize_option:
                print("Generating summary...")
                summary = summarize_text(text)
                print("Document Summary:")
                print(summary)
            with open("plagiarism_report.txt", "w") as f:
                f.write(result)
            print("Report saved to plagiarism_report.txt")

    elif choice == "3":
        print("Document Comparison Mode")
        text1 = input("Enter text for Document 1:\n")
        text2 = input("Enter text for Document 2:\n")
        if text1 and text2 and input("Compare Documents for Plagiarism? (yes/no): ").lower() == "yes":
            combined_text = f"Document 1:\n{text1}\n\nDocument 2:\n{text2}"
            print("Analyzing documents for plagiarism and similarity...")
            result = check_plagiarism(combined_text, custom_instructions)
            print("Comparison Plagiarism Check Result:")
            print(result)
            reports.append(result)
            with open("comparison_plagiarism_report.txt", "w") as f:
                f.write(result)
            print("Report saved to comparison_plagiarism_report.txt")

    # --- Sidebar: Report History ---
    if input("Clear History? (yes/no): ").lower() == "yes":
        reports = []
        print("Report history cleared.")
    if input("Show Report History? (yes/no): ").lower() == "yes":
        print("Past Reports:")
        for idx, report in enumerate(reports):
            print(f"Report {idx+1}:")
            print(report)
            print("---")

    # --- Footer ---
    print("Designed with ❤️ by Your Name. © 2025")

if __name__ == "__main__":
    main()
