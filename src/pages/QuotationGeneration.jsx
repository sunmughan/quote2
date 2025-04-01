import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Box,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Card,
  CardContent,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Chip,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { v4 as uuidv4 } from 'uuid';

const QuotationGeneration = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));
  const isExtraSmall = useMediaQuery(theme.breakpoints.down('xs'));
  
  const [quotationProducts, setQuotationProducts] = useState([]);
  
  // Customer information
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  
  // Staff information
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  
  // Company information
  const [companyName, setCompanyName] = useState('Prateek Tiles and Marble');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyCity, setCompanyCity] = useState('');
  const [companyState, setCompanyState] = useState('');
  const [companyZipCode, setCompanyZipCode] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  
  // Logo information
  const [companyLogo, setCompanyLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  
  // Quotation details
  const [taxRate, setTaxRate] = useState(18); // Default GST rate
  const [quotationNumber, setQuotationNumber] = useState('');
  const [quotationDate, setQuotationDate] = useState(new Date().toISOString().split('T')[0]);
  const [validityDays, setValidityDays] = useState(15);
  const [termsAndConditions, setTermsAndConditions] = useState(
    '1. Prices are subject to change without prior notice.\n' +
    '2. Delivery timeline: 7-10 working days after confirmation.\n' +
    '3. Payment Terms: 50% advance, balance before delivery.\n' +
    '4. Warranty as per manufacturer terms.\n' +
    '5. This quotation is valid for the mentioned validity period.'
  );
  
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  useEffect(() => {
    // Load products from localStorage
    const storedProducts = localStorage.getItem('quotationProducts');
    if (storedProducts) {
      setQuotationProducts(JSON.parse(storedProducts));
    }
    
    // Load staff from localStorage
    const savedStaff = JSON.parse(localStorage.getItem('staff') || '[]');
    setStaffList(savedStaff);
    
    // Load business settings from localStorage
    const savedSettings = JSON.parse(localStorage.getItem('businessSettings') || '{}');
    if (Object.keys(savedSettings).length > 0) {
      setCompanyName(savedSettings.businessName || 'Prateek Tiles and Marble');
      setCompanyAddress(savedSettings.businessAddress || '123 Main Street');
      setCompanyCity(savedSettings.businessCity || 'Mumbai');
      setCompanyState(savedSettings.businessState || 'Maharashtra');
      setCompanyZipCode(savedSettings.businessZipCode || '400001');
      setCompanyPhone(savedSettings.businessPhone || '+91 9876543210');
      setCompanyEmail(savedSettings.businessEmail || 'info@prateektiles.com');
      
      // Set logo from business settings
      if (savedSettings.logo) {
        setCompanyLogo(savedSettings.logo);
        setLogoPreview(savedSettings.logo);
      }
    } else {
      // Set default company information if no settings found
      setCompanyAddress('123 Main Street');
      setCompanyCity('Mumbai');
      setCompanyState('Maharashtra');
      setCompanyZipCode('400001');
      setCompanyPhone('+91 9876543210');
      setCompanyEmail('info@prateektiles.com');
    }
    
    // Generate a unique quotation number
    const generateQuotationNumber = () => {
      const date = new Date();
      const year = date.getFullYear().toString().substr(-2);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      return `PTM-${year}${month}${day}-${random}`;
    };
    
    setQuotationNumber(generateQuotationNumber());
  }, []);
  
  // Calculate subtotal
  const calculateSubtotal = () => {
    return quotationProducts.reduce((total, product) => {
      const productTotal = product.price * product.quantity;
      const discountAmount = (productTotal * product.discount) / 100;
      return total + (productTotal - discountAmount);
    }, 0);
  };
  
  // Calculate tax amount
  const calculateTaxAmount = () => {
    const subtotal = calculateSubtotal();
    return (subtotal * taxRate) / 100;
  };
  
  // Calculate grand total
  const calculateGrandTotal = () => {
    const subtotal = calculateSubtotal();
    const taxAmount = calculateTaxAmount();
    return subtotal + taxAmount;
  };
  
  // Handle staff selection
  const handleStaffChange = (event, newValue) => {
    setSelectedStaff(newValue);
    
    // Always update the company address with branch information when staff is selected
    if (newValue) {
      setCompanyAddress(newValue.branchAddress || '123 Main Street');
      setCompanyCity(newValue.branchCity || 'Mumbai');
      setCompanyState(newValue.branchState || 'Maharashtra');
      setCompanyZipCode(newValue.branchZipCode || '400001');
    }
  };
  
  // Handle logo upload
  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
        setCompanyLogo(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle logo removal
  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview('');
    setCompanyLogo(null);
  };
  
  // Handle saving the quotation
  const handleSaveQuotation = () => {
    if (!customerName) {
      setSnackbarMessage('Please enter customer name');
      setSnackbarOpen(true);
      return;
    }
    
    if (!selectedStaff) {
      setSnackbarMessage('Please select a salesperson');
      setSnackbarOpen(true);
      return;
    }
    
    const quotationData = {
      id: uuidv4(),
      quotationNumber,
      quotationDate,
      validityDays,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      // Staff information
      staffId: selectedStaff.id,
      staffName: selectedStaff.name,
      staffPosition: selectedStaff.position,
      staffCode: selectedStaff.staffCode,
      // Company information
      companyName,
      companyAddress,
      companyCity,
      companyState,
      companyZipCode,
      companyPhone,
      companyEmail,
      // Products and pricing
      products: quotationProducts,
      taxRate,
      subtotal: calculateSubtotal(),
      taxAmount: calculateTaxAmount(),
      grandTotal: calculateGrandTotal(),
      termsAndConditions,
      createdAt: new Date().toISOString()
    };
    
    // Get existing quotations from localStorage
    const existingQuotations = JSON.parse(localStorage.getItem('savedQuotations') || '[]');
    
    // Add new quotation
    const updatedQuotations = [quotationData, ...existingQuotations];
    
    // Save to localStorage
    localStorage.setItem('savedQuotations', JSON.stringify(updatedQuotations));
    
    setSnackbarMessage('Quotation saved successfully');
    setSnackbarOpen(true);
    
    // Navigate to quotation management after a short delay
    setTimeout(() => {
      navigate('/manage');
    }, 1500);
  };
  
  // Handle generating PDF
  const handleGeneratePDF = () => {
    if (!customerName) {
      setSnackbarMessage('Please enter customer name');
      setSnackbarOpen(true);
      return;
    }
    
    if (!selectedStaff) {
      setSnackbarMessage('Please select a salesperson');
      setSnackbarOpen(true);
      return;
    }
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 15;
    
    // Set consistent fonts throughout the document
    // Use helvetica for all text (default in jsPDF)
    doc.setFont('helvetica');
    
    // Draw border around the page
    doc.setDrawColor(0, 166, 126); // Green border color
    doc.setLineWidth(0.5);
    doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);
    
    // Add QUOTE header
    doc.setFontSize(28);
    doc.setTextColor(100, 100, 100); // Gray color
    doc.text('QUOTE', margin + 5, margin + 20);
    
    // Add date and invoice information
    doc.setFontSize(10);
    doc.text(`Date: ${quotationDate}`, pageWidth - margin - 60, margin + 15, { align: 'right' });
    doc.text(`Invoice # ${quotationNumber}`, pageWidth - margin - 60, margin + 22, { align: 'right' });
    doc.text(`Expiration Date: ${new Date(new Date(quotationDate).getTime() + validityDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`, pageWidth - margin - 60, margin + 29, { align: 'right' });
    
    // Add company information (left side)
    doc.setFontSize(10);
    doc.text(companyName, margin + 5, margin + 40);
    doc.text(companyAddress, margin + 5, margin + 47);
    doc.text(`${companyCity}, ${companyState} ${companyZipCode}`, margin + 5, margin + 54);
    doc.text(`Phone: ${companyPhone}`, margin + 5, margin + 61);
    doc.text(`Email: ${companyEmail}`, margin + 5, margin + 68);
    
    // Add logo if available
    if (companyLogo) {
      try {
        // Position the logo at the top of the document
        doc.addImage(companyLogo, 'JPEG', margin + 5, margin + 5, 40, 20);
      } catch (error) {
        console.error('Error adding logo to PDF:', error);
      }
    }
    
    // Add customer information (right side)
    doc.text(customerName, pageWidth - margin - 60, margin + 40, { align: 'right' });
    if (customerAddress) doc.text(customerAddress, pageWidth - margin - 60, margin + 47, { align: 'right' });
    if (customerPhone) doc.text(`Phone: ${customerPhone}`, pageWidth - margin - 60, margin + 54, { align: 'right' });
    doc.text(`Customer ID: ${quotationNumber.substring(4)}`, pageWidth - margin - 60, margin + 61, { align: 'right' });
    
    // Add salesperson and payment information table
    const salesTableY = margin + 75;
    doc.setDrawColor(0, 166, 126); // Green border color
    doc.setFillColor(0, 166, 126); // Green fill color
    doc.setTextColor(255, 255, 255); // White text
    
    // Table headers
    doc.rect(margin + 5, salesTableY, (pageWidth - 2 * margin - 10) / 4, 10, 'F');
    doc.rect(margin + 5 + (pageWidth - 2 * margin - 10) / 4, salesTableY, (pageWidth - 2 * margin - 10) / 4, 10, 'F');
    doc.rect(margin + 5 + 2 * (pageWidth - 2 * margin - 10) / 4, salesTableY, (pageWidth - 2 * margin - 10) / 4, 10, 'F');
    doc.rect(margin + 5 + 3 * (pageWidth - 2 * margin - 10) / 4, salesTableY, (pageWidth - 2 * margin - 10) / 4, 10, 'F');
    
    doc.text('Salesperson', margin + 10, salesTableY + 6);
    doc.text('Job', margin + 10 + (pageWidth - 2 * margin - 10) / 4, salesTableY + 6);
    doc.text('Payment Terms', margin + 10 + 2 * (pageWidth - 2 * margin - 10) / 4, salesTableY + 6);
    doc.text('Due Date', margin + 10 + 3 * (pageWidth - 2 * margin - 10) / 4, salesTableY + 6);
    
    // Table content
    doc.setDrawColor(0, 166, 126); // Green border color
    doc.setTextColor(0, 0, 0); // Black text
    
    doc.rect(margin + 5, salesTableY + 10, (pageWidth - 2 * margin - 10) / 4, 10);
    doc.rect(margin + 5 + (pageWidth - 2 * margin - 10) / 4, salesTableY + 10, (pageWidth - 2 * margin - 10) / 4, 10);
    doc.rect(margin + 5 + 2 * (pageWidth - 2 * margin - 10) / 4, salesTableY + 10, (pageWidth - 2 * margin - 10) / 4, 10);
    doc.rect(margin + 5 + 3 * (pageWidth - 2 * margin - 10) / 4, salesTableY + 10, (pageWidth - 2 * margin - 10) / 4, 10);
    
    doc.text(`${selectedStaff.name}`, margin + 10, salesTableY + 16);
    doc.text(selectedStaff.position, margin + 10 + (pageWidth - 2 * margin - 10) / 4, salesTableY + 16);
    doc.text('Due on receipt', margin + 10 + 2 * (pageWidth - 2 * margin - 10) / 4, salesTableY + 16);
    doc.text(quotationDate, margin + 10 + 3 * (pageWidth - 2 * margin - 10) / 4, salesTableY + 16);
    
    // Add product table
    const productTableY = salesTableY + 30;
    
    // Product table headers
    doc.setFillColor(0, 166, 126); // Green fill color
    doc.setTextColor(255, 255, 255); // White text
    
    doc.rect(margin + 5, productTableY, (pageWidth - 2 * margin - 10) / 5, 10, 'F');
    doc.rect(margin + 5 + (pageWidth - 2 * margin - 10) / 5, productTableY, 3 * (pageWidth - 2 * margin - 10) / 5, 10, 'F');
    doc.rect(margin + 5 + 4 * (pageWidth - 2 * margin - 10) / 5, productTableY, (pageWidth - 2 * margin - 10) / 5, 10, 'F');
    doc.rect(margin + 5 + 3 * (pageWidth - 2 * margin - 10) / 5, productTableY, (pageWidth - 2 * margin - 10) / 5, 10, 'F');
    
    doc.text('Quantity', margin + 10, productTableY + 6);
    doc.text('Description', margin + 10 + (pageWidth - 2 * margin - 10) / 5, productTableY + 6);
    doc.text('Unit Price', margin + 10 + 3 * (pageWidth - 2 * margin - 10) / 5, productTableY + 6);
    doc.text('Line Total', margin + 10 + 4 * (pageWidth - 2 * margin - 10) / 5, productTableY + 6);
    
    // Product table content
    doc.setTextColor(0, 0, 0); // Black text
    let currentY = productTableY + 10;
    
    // Set consistent font for all content
    doc.setFont('helvetica');
    
    quotationProducts.forEach((product, index) => {
      const productTotal = product.price * product.quantity;
      const discountAmount = (productTotal * product.discount) / 100;
      const finalTotal = productTotal - discountAmount;
      const rowHeight = 20; // Increased row height to prevent overflow
      
      // Draw row rectangles
      doc.rect(margin + 5, currentY, (pageWidth - 2 * margin - 10) / 5, rowHeight);
      doc.rect(margin + 5 + (pageWidth - 2 * margin - 10) / 5, currentY, 3 * (pageWidth - 2 * margin - 10) / 5, rowHeight);
      doc.rect(margin + 5 + 3 * (pageWidth - 2 * margin - 10) / 5, currentY, (pageWidth - 2 * margin - 10) / 5, rowHeight);
      doc.rect(margin + 5 + 4 * (pageWidth - 2 * margin - 10) / 5, currentY, (pageWidth - 2 * margin - 10) / 5, rowHeight);
      
      // Quantity column
      doc.setFontSize(10);
      doc.text(product.quantity.toString(), margin + 10, currentY + 10);
      
      // Description column - handle long text with proper wrapping
      const descriptionX = margin + 10 + (pageWidth - 2 * margin - 10) / 5;
      const descriptionWidth = 3 * (pageWidth - 2 * margin - 10) / 5 - 10;
      
      // Create product description with proper formatting
      let productDesc = product.brand || '';
      if (product.productCode) {
        productDesc += productDesc ? ` - ${product.productCode}` : product.productCode;
      }
      
      doc.text(productDesc, descriptionX, currentY + 7);
      
      // Add description on next line if it exists
      if (product.description) {
        doc.setFontSize(9); // Smaller font for description
        doc.text(product.description, descriptionX, currentY + 14, {
          maxWidth: descriptionWidth
        });
      }
      
      // Price columns - only show discounted price
      doc.setFontSize(10);
      // Show final price (already discounted) instead of original price
      const discountedUnitPrice = product.price - (product.price * product.discount / 100);
      doc.text(`₹${discountedUnitPrice.toFixed(2)}`, margin + 10 + 3 * (pageWidth - 2 * margin - 10) / 5, currentY + 10);
      doc.text(`₹${finalTotal.toFixed(2)}`, margin + 10 + 4 * (pageWidth - 2 * margin - 10) / 5, currentY + 10);
      
      currentY += rowHeight;
    });
    
    // Add totals
    const totalsY = currentY + 10;
    
    // Set consistent font for totals section
    doc.setFont('helvetica');
    doc.setFontSize(10);
    
    // Subtotal
    doc.text('Subtotal', pageWidth - margin - 60, totalsY);
    doc.text(`₹${calculateSubtotal().toFixed(2)}`, pageWidth - margin - 10, totalsY, { align: 'right' });
    
    // Tax
    doc.text(`GST (${taxRate}%)`, pageWidth - margin - 60, totalsY + 10);
    doc.text(`₹${calculateTaxAmount().toFixed(2)}`, pageWidth - margin - 10, totalsY + 10, { align: 'right' });
    
    // Total
    doc.setFont('helvetica', 'bold');
    doc.text('Total', pageWidth - margin - 60, totalsY + 20);
    doc.text(`₹${calculateGrandTotal().toFixed(2)}`, pageWidth - margin - 10, totalsY + 20, { align: 'right' });
    doc.setFont('helvetica', 'normal'); // Reset font weight
    
    // Add quotation prepared by
    doc.text(`Quotation prepared by: ${selectedStaff.name}`, margin + 5, totalsY + 40);
    
    // Add terms and conditions
    doc.text('This is a quotation on the goods named, subject to the conditions noted below:', margin + 5, totalsY + 50);
    
    const termsLines = termsAndConditions.split('\n');
    let termsY = totalsY + 60;
    
    termsLines.forEach(line => {
      doc.text(line, margin + 5, termsY);
      termsY += 7;
    });
    
    // Add signature line
    doc.text('To accept this quotation, sign here and return:', margin + 5, termsY + 10);
    doc.line(margin + 5, termsY + 20, pageWidth - margin - 5, termsY + 20);
    
    // Add logo at the bottom if available, otherwise show placeholder
    if (companyLogo) {
      try {
        doc.addImage(companyLogo, 'JPEG', margin + 5, termsY + 30, 40, 20);
      } catch (error) {
        // If error adding image, show placeholder
        doc.rect(margin + 5, termsY + 30, 40, 20);
        doc.text(companyName, margin + 25, termsY + 40, { align: 'center' });
      }
    } else {
      doc.rect(margin + 5, termsY + 30, 40, 20);
      doc.text(companyName, margin + 25, termsY + 40, { align: 'center' });
    }
    
    // Add thank you message
    doc.text('Thank you for your business', pageWidth - margin - 60, termsY + 40, { align: 'right' });
    
    // Save the PDF
    doc.save(`Quotation-${quotationNumber}.pdf`);
    
    setSnackbarMessage('PDF generated successfully');
    setSnackbarOpen(true);
  };
  
  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  
  return (
    <Container maxWidth="lg" sx={{ px: isSmall ? 1 : 2 }}>
      <Box sx={{ my: isSmall ? 2 : 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          className="page-title"
          sx={{ fontSize: isSmall ? '1.5rem' : '2rem' }}
        >
          Generate Quotation
        </Typography>
        
        <Paper className="section" sx={{ p: isSmall ? 2 : 3, mb: isSmall ? 2 : 3 }}>
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{ fontSize: isSmall ? '1rem' : '1.25rem' }}
          >
            Customer Information
          </Typography>
          
          <Grid container spacing={isSmall ? 2 : 3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Customer Name"
                fullWidth
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                size={isSmall ? "small" : "medium"}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                fullWidth
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                size={isSmall ? "small" : "medium"}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone"
                fullWidth
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                size={isSmall ? "small" : "medium"}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Address"
                fullWidth
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                size={isSmall ? "small" : "medium"}
              />
            </Grid>
          </Grid>
        </Paper>
        
        <Paper className="section" sx={{ p: isSmall ? 2 : 3, mb: isSmall ? 2 : 3 }}>
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{ fontSize: isSmall ? '1rem' : '1.25rem' }}
          >
            Quotation Details
          </Typography>
          
          <Grid container spacing={isSmall ? 2 : 3}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Quotation Number"
                fullWidth
                value={quotationNumber}
                onChange={(e) => setQuotationNumber(e.target.value)}
                InputProps={{ readOnly: true }}
                size={isSmall ? "small" : "medium"}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Date"
                type="date"
                fullWidth
                value={quotationDate}
                onChange={(e) => setQuotationDate(e.target.value)}
                size={isSmall ? "small" : "medium"}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Validity (Days)"
                type="number"
                fullWidth
                value={validityDays}
                onChange={(e) => setValidityDays(parseInt(e.target.value) || 15)}
                InputProps={{ inputProps: { min: 1 } }}
                size={isSmall ? "small" : "medium"}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="GST Rate (%)"
                type="number"
                fullWidth
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                InputProps={{ inputProps: { min: 0, max: 100 } }}
                size={isSmall ? "small" : "medium"}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={staffList}
                getOptionLabel={(option) => `${option.name} (${option.branch})`}
                value={selectedStaff}
                onChange={handleStaffChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Salesperson"
                    fullWidth
                    required
                    size={isSmall ? "small" : "medium"}
                  />
                )}
                size={isSmall ? "small" : "medium"}
              />
            </Grid>
          </Grid>
        </Paper>
        
        <Paper className="section" sx={{ p: isSmall ? 2 : 3, mb: isSmall ? 2 : 3 }}>
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{ fontSize: isSmall ? '1rem' : '1.25rem' }}
          >
            Products
          </Typography>
          
          {quotationProducts.length === 0 ? (
            <Alert severity="info">
              No products added to quotation yet. Please select products first.
            </Alert>
          ) : (
            <Box className="responsive-table" sx={{ overflowX: 'auto' }}>
              <TableContainer>
                <Table size={isSmall ? "small" : "medium"}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Unit Price (₹)</TableCell>
                      <TableCell align="right">Qty</TableCell>
                      <TableCell align="right">Total (₹)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {quotationProducts.map((product) => {
                      // Calculate discounted unit price
                      const discountedUnitPrice = product.price - (product.price * product.discount / 100);
                      const finalTotal = discountedUnitPrice * product.quantity;
                      
                      return (
                        <TableRow key={product.id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                              <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: isSmall ? '0.75rem' : '0.875rem' }}>
                                {product.brand} {product.productCode && `- ${product.productCode}`}
                              </Typography>
                              {product.description && (
                                <Typography variant="body2" sx={{ fontSize: isSmall ? '0.75rem' : '0.875rem' }}>
                                  {product.description}
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell align="right">₹{discountedUnitPrice.toFixed(2)}</TableCell>
                          <TableCell align="right">{product.quantity}</TableCell>
                          <TableCell align="right">₹{finalTotal.toFixed(2)}</TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow>
                      <TableCell colSpan={4} align="right" sx={{ fontWeight: 'bold' }}>
                        Subtotal:
                      </TableCell>
                      <TableCell align="right">
                        ₹{calculateSubtotal().toFixed(2)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={4} align="right" sx={{ fontWeight: 'bold' }}>
                        GST ({taxRate}%):
                      </TableCell>
                      <TableCell align="right">
                        ₹{calculateTaxAmount().toFixed(2)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={4} align="right" sx={{ fontWeight: 'bold' }}>
                        Grand Total:
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        ₹{calculateGrandTotal().toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Paper>
        
        <Paper className="section" sx={{ p: isSmall ? 2 : 3, mb: isSmall ? 2 : 3 }}>
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{ fontSize: isSmall ? '1rem' : '1.25rem' }}
          >
            Terms and Conditions
          </Typography>
          
          <TextField
            multiline
            rows={4}
            fullWidth
            value={termsAndConditions}
            onChange={(e) => setTermsAndConditions(e.target.value)}
            size={isSmall ? "small" : "medium"}
          />
        </Paper>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          flexDirection: isSmall ? 'column' : 'row',
          gap: isSmall ? 2 : 0
        }}>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/')}
            sx={{ width: isSmall ? '100%' : 'auto' }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSaveQuotation}
            sx={{ width: isSmall ? '100%' : 'auto' }}
          >
            Generate Quotation
          </Button>
        </Box>
      </Box>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="info">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default QuotationGeneration;