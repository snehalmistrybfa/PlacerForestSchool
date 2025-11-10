/**
 * Google Apps Script to Create Placer Forest School Forms
 * 
 * Instructions:
 * 1. Go to script.google.com
 * 2. Create a new project
 * 3. Replace the default code with this script
 * 4. Run the createPlacerForestSchoolForms() function
 * 5. Check the logs for the form URLs and entry IDs
 */

function createPlacerForestSchoolForms() {
  try {
    // Create both forms
    const contactForm = createContactForm();
    const enrollmentForm = createEnrollmentForm();
    
    // Log the results
    console.log('=== FORMS CREATED SUCCESSFULLY ===');
    console.log('');
    console.log('CONTACT FORM:');
    console.log('URL:', contactForm.url);
    console.log('Form Response URL:', contactForm.responseUrl);
    console.log('Entry IDs:', JSON.stringify(contactForm.entryIds, null, 2));
    console.log('');
    console.log('ENROLLMENT FORM:');
    console.log('URL:', enrollmentForm.url);
    console.log('Form Response URL:', enrollmentForm.responseUrl);
    console.log('Entry IDs:', JSON.stringify(enrollmentForm.entryIds, null, 2));
    console.log('');
    console.log('=== NEXT STEPS ===');
    console.log('1. Copy the Form Response URLs and Entry IDs');
    console.log('2. Update your website files with these values');
    console.log('3. Test the forms by submitting them');
    
    return {
      contact: contactForm,
      enrollment: enrollmentForm
    };
    
  } catch (error) {
    console.error('Error creating forms:', error);
    throw error;
  }
}

function createContactForm() {
  console.log('Creating Contact Form...');
  
  // Create the form
  const form = FormApp.create('Placer Forest School - Contact');
  form.setDescription('Contact form for Placer Forest School inquiries');
  form.setCollectEmail(false);
  form.setAllowResponseEdits(false);
  form.setAcceptingResponses(true);
  
  // Add fields
  const nameItem = form.addTextItem()
    .setTitle('Your Name')
    .setRequired(true);
  
  const emailItem = form.addTextItem()
    .setTitle('Email Address')
    .setRequired(true);
  
  const phoneItem = form.addTextItem()
    .setTitle('Phone Number')
    .setRequired(false);
  
  const childAgeItem = form.addTextItem()
    .setTitle("Child's Age")
    .setRequired(false);
  
  const inquiryTypeItem = form.addMultipleChoiceItem()
    .setTitle('Type of Inquiry')
    .setChoiceValues([
      'General Information',
      'Enrollment Questions', 
      'Program Details',
      'Schedule Information',
      'Other'
    ])
    .setRequired(true);
  
  const messageItem = form.addParagraphTextItem()
    .setTitle('Your Message')
    .setRequired(true);
  
  // Get form URL and create response URL
  const formUrl = form.getPublishedUrl();
  const formId = form.getId();
  const responseUrl = `https://docs.google.com/forms/d/e/${formId}/formResponse`;
  
  // Get entry IDs by inspecting the form
  const items = form.getItems();
  const entryIds = {
    name: getEntryId(items[0]),
    email: getEntryId(items[1]),
    phone: getEntryId(items[2]),
    childAge: getEntryId(items[3]),
    inquiryType: getEntryId(items[4]),
    message: getEntryId(items[5])
  };
  
  console.log('Contact Form created successfully');
  
  return {
    form: form,
    url: formUrl,
    responseUrl: responseUrl,
    entryIds: entryIds
  };
}

function createEnrollmentForm() {
  console.log('Creating Enrollment Form...');
  
  // Create the form
  const form = FormApp.create('Placer Forest School - Enrollment Application');
  form.setDescription('Complete enrollment application for Placer Forest School');
  form.setCollectEmail(false);
  form.setAllowResponseEdits(false);
  form.setAcceptingResponses(true);
  
  // Program Selection
  form.addMultipleChoiceItem()
    .setTitle('Select Program')
    .setChoiceValues(['Friday Program (9 AM - 1 PM)'])
    .setRequired(true);
  
  // Child 1 Information
  form.addSectionHeaderItem().setTitle('Child 1 Information');
  form.addTextItem().setTitle('Child 1 - Full Name').setRequired(true);
  form.addDateItem().setTitle('Child 1 - Date of Birth').setRequired(true);
  form.addParagraphTextItem().setTitle('Child 1 - Special Considerations').setRequired(false);
  
  // Child 2 Information
  form.addSectionHeaderItem().setTitle('Child 2 Information (Optional)');
  form.addTextItem().setTitle('Child 2 - Full Name').setRequired(false);
  form.addDateItem().setTitle('Child 2 - Date of Birth').setRequired(false);
  form.addParagraphTextItem().setTitle('Child 2 - Special Considerations').setRequired(false);
  
  // Child 3 Information
  form.addSectionHeaderItem().setTitle('Child 3 Information (Optional)');
  form.addTextItem().setTitle('Child 3 - Full Name').setRequired(false);
  form.addDateItem().setTitle('Child 3 - Date of Birth').setRequired(false);
  form.addParagraphTextItem().setTitle('Child 3 - Special Considerations').setRequired(false);
  
  // Child 4 Information
  form.addSectionHeaderItem().setTitle('Child 4 Information (Optional)');
  form.addTextItem().setTitle('Child 4 - Full Name').setRequired(false);
  form.addDateItem().setTitle('Child 4 - Date of Birth').setRequired(false);
  form.addParagraphTextItem().setTitle('Child 4 - Special Considerations').setRequired(false);
  
  // Child 5 Information
  form.addSectionHeaderItem().setTitle('Child 5 Information (Optional)');
  form.addTextItem().setTitle('Child 5 - Full Name').setRequired(false);
  form.addDateItem().setTitle('Child 5 - Date of Birth').setRequired(false);
  form.addParagraphTextItem().setTitle('Child 5 - Special Considerations').setRequired(false);
  
  // Parent Information
  form.addSectionHeaderItem().setTitle('Parent/Guardian Information');
  form.addTextItem().setTitle('Parent/Guardian Name').setRequired(true);
  form.addTextItem().setTitle('Phone Number').setRequired(true);
  form.addTextItem().setTitle('Email Address').setRequired(true);
  form.addParagraphTextItem().setTitle('Home Address').setRequired(true);
  
  // Emergency Contact
  form.addSectionHeaderItem().setTitle('Emergency Contact');
  form.addTextItem().setTitle('Emergency Contact Name').setRequired(true);
  form.addTextItem().setTitle('Emergency Contact Phone').setRequired(true);
  form.addTextItem().setTitle('Relationship to Child').setRequired(true);
  
  // Medical Information
  form.addSectionHeaderItem().setTitle('Medical Information');
  form.addParagraphTextItem().setTitle('Allergies, Medical Conditions, and Medications').setRequired(false);
  form.addParagraphTextItem().setTitle('Dietary Restrictions').setRequired(false);
  
  // Waivers
  form.addSectionHeaderItem().setTitle('Waivers and Permissions');
  form.addCheckboxItem()
    .setTitle('Participation Waiver')
    .setChoiceValues(['I acknowledge that outdoor forest school activities involve inherent risks and that my child is physically and emotionally capable of participating in the program.'])
    .setRequired(true);
  
  form.addCheckboxItem()
    .setTitle('Liability Waiver')
    .setChoiceValues(['I release Placer Forest School, its instructors, and associated parties from any liability for injuries or damages that may occur during participation in the program.'])
    .setRequired(true);
  
  form.addCheckboxItem()
    .setTitle('Medical Emergency Authorization')
    .setChoiceValues(['I authorize Placer Forest School staff to seek emergency medical treatment for my child if needed and agree to be responsible for any associated costs.'])
    .setRequired(true);
  
  form.addMultipleChoiceItem()
    .setTitle('Photo/Video Permission')
    .setChoiceValues([
      'Yes, I give permission for my child to be included in photos/videos',
      'No, I do not give permission for my child to be included in photos/videos'
    ])
    .setRequired(true);
  
  // Additional Information
  form.addSectionHeaderItem().setTitle('Additional Information');
  form.addParagraphTextItem().setTitle('Anything else you\'d like us to know about your child or family?').setRequired(false);
  
  // Get form URL and create response URL
  const formUrl = form.getPublishedUrl();
  const formId = form.getId();
  const responseUrl = `https://docs.google.com/forms/d/e/${formId}/formResponse`;
  
  // Get entry IDs
  const items = form.getItems();
  const entryIds = mapEnrollmentEntryIds(items);
  
  console.log('Enrollment Form created successfully');
  
  return {
    form: form,
    url: formUrl,
    responseUrl: responseUrl,
    entryIds: entryIds
  };
}

function mapEnrollmentEntryIds(items) {
  // Map items to their purposes (skipping section headers)
  const fieldItems = items.filter(item => item.getType() !== FormApp.ItemType.SECTION_HEADER);
  
  return {
    program: getEntryId(fieldItems[0]),
    child1Name: getEntryId(fieldItems[1]),
    child1DOB: getEntryId(fieldItems[2]),
    child1Special: getEntryId(fieldItems[3]),
    child2Name: getEntryId(fieldItems[4]),
    child2DOB: getEntryId(fieldItems[5]),
    child2Special: getEntryId(fieldItems[6]),
    child3Name: getEntryId(fieldItems[7]),
    child3DOB: getEntryId(fieldItems[8]),
    child3Special: getEntryId(fieldItems[9]),
    child4Name: getEntryId(fieldItems[10]),
    child4DOB: getEntryId(fieldItems[11]),
    child4Special: getEntryId(fieldItems[12]),
    child5Name: getEntryId(fieldItems[13]),
    child5DOB: getEntryId(fieldItems[14]),
    child5Special: getEntryId(fieldItems[15]),
    parentName: getEntryId(fieldItems[16]),
    parentPhone: getEntryId(fieldItems[17]),
    parentEmail: getEntryId(fieldItems[18]),
    address: getEntryId(fieldItems[19]),
    emergencyName: getEntryId(fieldItems[20]),
    emergencyPhone: getEntryId(fieldItems[21]),
    emergencyRelationship: getEntryId(fieldItems[22]),
    medicalInfo: getEntryId(fieldItems[23]),
    dietaryRestrictions: getEntryId(fieldItems[24]),
    participationWaiver: getEntryId(fieldItems[25]),
    liabilityWaiver: getEntryId(fieldItems[26]),
    medicalEmergency: getEntryId(fieldItems[27]),
    photoPermission: getEntryId(fieldItems[28]),
    additionalInfo: getEntryId(fieldItems[29])
  };
}

function getEntryId(item) {
  // Google Forms entry IDs are based on the item ID
  // This is a simplified approach - the actual entry ID might need to be extracted differently
  return `entry.${item.getId()}`;
}

// Helper function to set up email notifications
function setupEmailNotifications() {
  console.log('To set up email notifications:');
  console.log('1. Open each form');
  console.log('2. Go to Responses tab');
  console.log('3. Click three-dot menu');
  console.log('4. Select "Get email notifications for new responses"');
}

// Run this function to create both forms
function main() {
  createPlacerForestSchoolForms();
  setupEmailNotifications();
}
