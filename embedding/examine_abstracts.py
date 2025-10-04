import os
import csv
import xml.etree.ElementTree as ET
import sys

def extract_abstracts_to_csv(xml_directory, output_csv_file):
    """
    Parses all XML files in a directory to extract text from the <abstract> tag
    and saves the content to a CSV file.

    Args:
        xml_directory (str): The path to the directory containing XML files.
        output_csv_file (str): The path for the output CSV file.
    """
    print(f"Searching for XML files in '{xml_directory}'...")

    # Step 1: Find all XML files and sort them alphabetically to assign IDs.
    try:
        # Get a list of all files in the directory that end with .xml
        files = [f for f in os.listdir(xml_directory) if f.lower().endswith('.xml')]
        files.sort()  # Sort the list alphabetically
        
        if not files:
            print(f"Error: No XML files found in the directory: {xml_directory}")
            return
            
        print(f"Found {len(files)} XML files to process.")

    except FileNotFoundError:
        print(f"Error: Directory not found at '{xml_directory}'. Please ensure the path is correct.")
        return

    # Step 2: Open the output CSV file for writing.
    with open(output_csv_file, 'w', newline='', encoding='utf-8') as csvfile:
        csv_writer = csv.writer(csvfile)
        
        # Write the header row to the CSV file.
        csv_writer.writerow(['ID', 'Abstract'])

        # Define the namespace for TEI XML files. This is crucial for finding tags.
        ns = {'tei': 'http://www.tei-c.org/ns/1.0'}

        # Step 3: Loop through each file, extract data, and write to the CSV.
        for i, filename in enumerate(files):
            file_id = i + 1  # Assign ID starting from 1.
            file_path = os.path.join(xml_directory, filename)
            
            try:
                tree = ET.parse(file_path)
                root = tree.getroot()

                # Find the <abstract> element using its path and the namespace.
                # The './/' means it will search the entire tree for the tag.
                abstract_element = root.find('.//tei:abstract', ns)
                
                abstract_text = ""
                if abstract_element is not None:
                    # If the tag is found, join all text fragments within it.
                    abstract_text = "".join(abstract_element.itertext()).strip()
                    # Clean up text by replacing newlines/multiple spaces with a single space.
                    abstract_text = ' '.join(abstract_text.split())
                else:
                    abstract_text = "Abstract not found"
                    print(f"Warning: <abstract> tag not found in {filename}")

                # Write the ID and the extracted abstract text as a new row in the CSV.
                csv_writer.writerow([file_id, abstract_text])

            except ET.ParseError:
                error_message = f"Error parsing file: {filename}"
                print(f"Error: Could not parse {filename}. It might be a malformed XML file.")
                csv_writer.writerow([file_id, error_message])
            except Exception as e:
                error_message = f"An unexpected error occurred: {e}"
                print(f"An unexpected error occurred with file {filename}: {e}")
                csv_writer.writerow([file_id, error_message])

    print(f"\nProcessing complete. Data has been successfully saved to '{output_csv_file}'.")


# --- Main execution block ---
if __name__ == '__main__':
    script_dir = os.path.dirname(os.path.abspath(sys.argv[0]))
    output_csv_path = os.path.join(script_dir, 'abstracts.csv')
    xml_folder_path = os.path.join(script_dir, '..', 'datas', 'grobid_output')
    xml_folder_path = os.path.normpath(xml_folder_path)

    # Check if the calculated input directory exists before running the main function.
    if not os.path.isdir(xml_folder_path):
        print(f"Error: The XML directory was not found at the expected location: '{xml_folder_path}'")
        print("Please ensure your directory structure matches the one described in the script's comments.")
    else:
        # Run the main function with the dynamically determined paths.
        extract_abstracts_to_csv(xml_folder_path, output_csv_path)