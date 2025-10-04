import os
import xml.etree.ElementTree as ET
import csv  # CSV modülünü içe aktarıyoruz

def count_keywords():
    """
    Scans all .xml files in the grobid_output directory,
    counts the <term> tags within the <keywords> tag, and
    returns the results as a dictionary.
    """
    keyword_counts = {}
    # Define the namespace used in the XML files
    namespace = {'tei': 'http://www.tei-c.org/ns/1.0'}

    # Define the path to grobid_output folder
    grobid_path = os.path.join('..', 'datas/grobid_output')

    # Check if the directory exists
    if not os.path.exists(grobid_path):
        print(f"Error: Directory '{grobid_path}' not found.")
        return keyword_counts

    # List all files in the grobid_output directory
    for file_name in os.listdir(grobid_path):
        # Process only files with the .xml extension
        if file_name.endswith('.xml'):
            try:
                # Parse the XML file with full path
                full_path = os.path.join(grobid_path, file_name)
                tree = ET.parse(full_path)
                root = tree.getroot()

                # Find the 'keywords' element using its namespace
                keywords_element = root.find('.//tei:keywords', namespace)

                # Proceed only if the <keywords> tag was found
                if keywords_element is not None:
                    # Use a temporary set to store keywords found in this file
                    keywords_in_file = set()
                    
                    # Find all <term> tags within the <keywords> element
                    for term_element in keywords_element.findall('tei:term', namespace):
                        if term_element.text:
                            # Get the keyword, convert it to lowercase, and replace spaces with underscores
                            keyword = term_element.text.strip().lower().replace(' ', '_')
                            keywords_in_file.add(keyword)
                    
                    # Increment the main counter for each unique keyword found
                    for keyword in keywords_in_file:
                        keyword_counts[keyword] = keyword_counts.get(keyword, 0) + 1
            
            except ET.ParseError:
                print(f"Warning: '{file_name}' is not a well-formed XML file or is corrupted.")
            except Exception as e:
                print(f"An error occurred while processing '{file_name}': {e}")

    return keyword_counts

if __name__ == "__main__":
    count_results = count_keywords()

    if count_results:
        # Print the results
        csv_file_name = 'summarizating_files/keyword_counts.csv'
        try:
            with open(csv_file_name, mode='w', newline='', encoding='utf-8') as csv_file:
                writer = csv.writer(csv_file)

                writer.writerow(['keyword', 'count'])

                # Write each keyword and its count to the CSV file
                for keyword, count in sorted(count_results.items()):
                    writer.writerow([keyword, count])
            
            print(f"Results successfully saved to '{csv_file_name}'")

        except Exception as e:
            print(f"An error occurred while writing to CSV file: {e}")
    else:
        print("No .xml files were found in the grobid_output directory, or no files contained the <keywords> tag.")