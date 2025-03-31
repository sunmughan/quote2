import React, { useState, useEffect, ChangeEvent, SyntheticEvent } from 'react';

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
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  InputAdornment,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';


// Add FormChangeEvent type definition
type FormChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string | number } };

interface TilesProduct {
  id: string;
  sno?: string;
  brand: string;
  areaOfApplication: string;
  shadeName: string;
  image: string;
  dimensions: string;
  surface: string;
  mrp: number;
  discount: number;
  discountedPrice: number;
  areaRequired: number;
  noOfBoxes: number;
  totalAmount: number;
}

interface AdhesiveProduct {
  id: string;
  sno?: string;
  brand: string;
  category: string;
  mrp: number;
  dPrice: number;
  noOfBags: number;
  totalAmount: number;
}

interface CPSWProduct {
  id: string;
  sno?: string;
  brand: string;
  productCode: string;
  description: string;
  image: string;
  mrp: number;
  dPrice: number;
  nos: number;
  totalAmount: number;
}

interface Products {
  tiles: TilesProduct[];
  adhesive: AdhesiveProduct[];
  'cp-sw': CPSWProduct[];
}


const ProductManagement: React.FC = () => {
  // State for tabs
  const [activeTab, setActiveTab] = useState<keyof Products>('tiles');
  
  // State for products
  const [products, setProducts] = useState<Products>({
    tiles: [],
    adhesive: [],
    'cp-sw': []
  });
  
  // State for filtered products
  const [filteredProducts, setFilteredProducts] = useState<(TilesProduct | AdhesiveProduct | CPSWProduct)[]>([]);
  
  // State for search
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [selectedProduct, setSelectedProduct] = useState<TilesProduct | AdhesiveProduct | CPSWProduct | null>(null);
  
  // State for snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  
  // Form state for tiles
  const [tilesForm, setTilesForm] = useState<TilesProduct>({
    id: '',
    brand: '',
    areaOfApplication: '',
    shadeName: '',
    image: '',
    dimensions: '',
    surface: '',
    mrp: 0,
    discount: 0,
    discountedPrice: 0,
    areaRequired: 0,
    noOfBoxes: 0,
    totalAmount: 0
  });
  
  // Form state for adhesive
  const [adhesiveForm, setAdhesiveForm] = useState<AdhesiveProduct>({
    id: '',
    brand: '',
    category: '',
    mrp: 0,
    dPrice: 0,
    noOfBags: 0,
    totalAmount: 0
  });
  
  // Form state for CP & SW
  const [cpswForm, setCpswForm] = useState<CPSWProduct>({
    id: '',
    brand: '',
    productCode: '',
    description: '',
    image: '',
    mrp: 0,
    dPrice: 0,
    nos: 0,
    totalAmount: 0
  });
  
  // Load products from localStorage on component mount
  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem('products') || '{}');
    if (Object.keys(savedProducts).length > 0) {
      setProducts(savedProducts);
    }
    filterProducts(activeTab, '');
  }, []);
  
  // Update filtered products when active tab changes
  useEffect(() => {
    filterProducts(activeTab, searchTerm);
  }, [activeTab, products]);
  
  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: keyof Products) => {
    setActiveTab(newValue);
    setSearchTerm('');
  };
  
  // Update the filterProducts function with proper type handling
  const filterProducts = (category: keyof Products, term: string) => {
    if (!term) {
      setFilteredProducts(products[category]);
    } else {
      const filtered = products[category].filter((product) => {
        if (category === 'tiles') {
          const p = product as TilesProduct;
          return (
            p.brand.toLowerCase().includes(term.toLowerCase()) ||
            p.shadeName.toLowerCase().includes(term.toLowerCase())
          );
        } else if (category === 'adhesive') {
          const p = product as AdhesiveProduct;
          return (
            p.brand.toLowerCase().includes(term.toLowerCase()) ||
            p.category.toLowerCase().includes(term.toLowerCase())
          );
        } else {
          const p = product as CPSWProduct;
          return (
            p.brand.toLowerCase().includes(term.toLowerCase()) ||
            p.productCode.toLowerCase().includes(term.toLowerCase()) ||
            p.description.toLowerCase().includes(term.toLowerCase())
          );
        }
      });
      setFilteredProducts(filtered);
    }
  };
  
  // Handle search
  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    filterProducts(activeTab, term);
  };
  
  // Open dialog for adding a new product
  const handleAddProduct = () => {
    setDialogMode('add');
    
    // Reset form based on active tab
    if (activeTab === 'tiles') {
      setTilesForm({
        id: '',
        brand: '',
        areaOfApplication: '',
        shadeName: '',
        image: '',
        dimensions: '',
        surface: '',
        mrp: 0,
        discount: 0,
        discountedPrice: 0,
        areaRequired: 0,
        noOfBoxes: 0,
        totalAmount: 0
      });
    } else if (activeTab === 'adhesive') {
      setAdhesiveForm({
        id: '',
        brand: '',
        category: '',
        mrp: 0,
        dPrice: 0,
        noOfBags: 0,
        totalAmount: 0
      });
    } else { // cp-sw
      setCpswForm({
        id: '',
        brand: '',
        productCode: '',
        description: '',
        image: '',
        mrp: 0,
        dPrice: 0,
        nos: 0,
        totalAmount: 0
      });
    }
    
    setDialogOpen(true);
  };
  
  // Open dialog for editing a product
  const handleEditProduct = (product: TilesProduct | AdhesiveProduct | CPSWProduct) => {
    setDialogMode('edit');
    setSelectedProduct(product);
    
    // Set form based on active tab
    if (activeTab === 'tiles') {
      setTilesForm({
        ...product
      });
    } else if (activeTab === 'adhesive') {
      setAdhesiveForm({
        ...product
      });
    } else { // cp-sw
      setCpswForm({
        ...product
      });
    }
    
    setDialogOpen(true);
  };
  
  // Handle dialog close
  const handleDialogClose = () => {
    setDialogOpen(false);
  };
  
  // Handle form change for tiles
  const handleTilesFormChange = (event: FormChangeEvent): void => {
    const { name, value } = event.target;
    let updatedForm = { ...tilesForm, [name]: value };
    
    if (name === 'mrp' || name === 'discount') {
      const mrp = name === 'mrp' ? parseFloat(String(value)) || 0 : tilesForm.mrp;
      const discount = name === 'discount' ? parseFloat(String(value)) || 0 : tilesForm.discount;
      const discountedPrice = mrp - (mrp * discount / 100);
      updatedForm = { ...updatedForm, discountedPrice, mrp, discount };
    }
    
    if (name === 'discountedPrice' || name === 'areaRequired' || name === 'noOfBoxes') {
      const discountedPrice = name === 'discountedPrice' ? parseFloat(String(value)) || 0 : tilesForm.discountedPrice;
      const areaRequired = name === 'areaRequired' ? parseFloat(String(value)) || 0 : tilesForm.areaRequired;
      const noOfBoxes = name === 'noOfBoxes' ? parseInt(String(value)) || 0 : tilesForm.noOfBoxes;
      const totalAmount = discountedPrice * areaRequired * noOfBoxes;
      updatedForm = { ...updatedForm, discountedPrice, areaRequired, noOfBoxes, totalAmount };
    }
    
    setTilesForm(updatedForm as TilesProduct);
  };
  
  // Handle form change for adhesive
  const handleAdhesiveFormChange = (event: FormChangeEvent): void => {
    const { name, value } = event.target;
    let updatedForm = { ...adhesiveForm, [name]: value };
    
    if (name === 'dPrice' || name === 'noOfBags') {
      const dPrice = name === 'dPrice' ? parseFloat(String(value)) || 0 : adhesiveForm.dPrice;
      const noOfBags = name === 'noOfBags' ? parseInt(String(value)) || 0 : adhesiveForm.noOfBags;
      const totalAmount = dPrice * noOfBags;
      updatedForm = { ...updatedForm, dPrice, noOfBags, totalAmount };
    }
    
    setAdhesiveForm(updatedForm as AdhesiveProduct);
  };
  
  // Handle form change for CP & SW
  const handleCpswFormChange = (event: FormChangeEvent): void => {
    const { name, value } = event.target;
    let updatedForm = { ...cpswForm, [name]: value };
    
    if (name === 'dPrice' || name === 'nos') {
      const dPrice = name === 'dPrice' ? parseFloat(String(value)) || 0 : cpswForm.dPrice;
      const nos = name === 'nos' ? parseInt(String(value)) || 0 : cpswForm.nos;
      const totalAmount = dPrice * nos;
      updatedForm = { ...updatedForm, dPrice, nos, totalAmount };
    }
    
    setCpswForm(updatedForm as CPSWProduct);
  };
  
  // Handle image upload with proper type safety
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, category: 'tiles' | 'cp-sw'): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (category === 'tiles') {
          setTilesForm(prev => ({ ...prev, image: result }));
        } else if (category === 'cp-sw') {
          setCpswForm(prev => ({ ...prev, image: result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle save product
  const handleSaveProduct = (): void => {
    let newProducts = { ...products };
    let message = '';
    
    if (activeTab === 'tiles') {
      if (dialogMode === 'add') {
        const newProduct = {
          ...tilesForm,
          id: uuidv4(),
          sno: (products.tiles.length + 1).toString()
        };
        newProducts.tiles = [...products.tiles, newProduct];
        message = 'Tile product added successfully';
      } else { // edit
        newProducts.tiles = products.tiles.map(product => 
          product.id === selectedProduct?.id ? { ...tilesForm } : product
        );
        message = 'Tile product updated successfully';
      }
    } else if (activeTab === 'adhesive') {
      if (dialogMode === 'add') {
        const newProduct = {
          ...adhesiveForm,
          id: uuidv4(),
          sno: (products.adhesive.length + 1).toString()
        };
        newProducts.adhesive = [...products.adhesive, newProduct];
        message = 'Adhesive product added successfully';
      } else { // edit
        newProducts.adhesive = products.adhesive.map(product => 
          product.id === selectedProduct?.id ? { ...adhesiveForm } : product
        );
        message = 'Adhesive product updated successfully';
      }
    } else { // cp-sw
      if (dialogMode === 'add') {
        const newProduct = {
          ...cpswForm,
          id: uuidv4(),
          sno: (products['cp-sw'].length + 1).toString()
        };
        newProducts['cp-sw'] = [...products['cp-sw'], newProduct];
        message = 'CP & SW product added successfully';
      } else { // edit
        newProducts['cp-sw'] = products['cp-sw'].map(product => 
          product.id === selectedProduct?.id ? { ...cpswForm } : product
        );
        message = 'CP & SW product updated successfully';
      }
    }
    
    // Update state and localStorage
    setProducts(newProducts);
    localStorage.setItem('products', JSON.stringify(newProducts));
    
    // Show success message
    setSnackbarMessage(message);
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
    
    // Close dialog
    handleDialogClose();
  };
  
  // Handle delete product
  const handleDeleteProduct = (productId: string): void => {
    let newProducts = { ...products };
    let message = '';
    
    if (activeTab === 'tiles') {
      newProducts.tiles = products.tiles.filter(product => product.id !== productId);
      message = 'Tile product deleted successfully';
    } else if (activeTab === 'adhesive') {
      newProducts.adhesive = products.adhesive.filter(product => product.id !== productId);
      message = 'Adhesive product deleted successfully';
    } else { // cp-sw
      newProducts['cp-sw'] = products['cp-sw'].filter(product => product.id !== productId);
      message = 'CP & SW product deleted successfully';
    }
    
    // Update state and localStorage
    setProducts(newProducts);
    localStorage.setItem('products', JSON.stringify(newProducts));
    
    // Show success message
    setSnackbarMessage(message);
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };
  
  // Handle snackbar close
  const handleSnackbarClose = (_event?: React.SyntheticEvent | Event, reason?: string): void => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };
  
  // Get category display name
  const getCategoryName = (): string => {
    switch(activeTab) {
      case 'tiles': return 'Tiles';
      case 'adhesive': return 'Adhesive';
      case 'cp-sw': return 'CP & SW';
      default: return 'Products';
    }
  };
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom className="page-title">
          Product Management
        </Typography>
        
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Tiles" value="tiles" />
            <Tab label="Adhesive" value="adhesive" />
            <Tab label="CP & SW" value="cp-sw" />
          </Tabs>
        </Paper>
        
        <Paper className="section" sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              {getCategoryName()} Products
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                placeholder={`Search ${getCategoryName()}`}
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: '250px' }}
              />
              
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddProduct}
              >
                Add {getCategoryName().slice(0, -1)}
              </Button>
            </Box>
          </Box>
          
          {filteredProducts.length === 0 ? (
            <Alert severity="info">
              No {getCategoryName().toLowerCase()} products found. Add some products to get started.
            </Alert>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>S.No</TableCell>
                    <TableCell>Brand</TableCell>
                    
                    {activeTab === 'tiles' && (
                      <>
                        <TableCell>Area of Application</TableCell>
                        <TableCell>Shade Name</TableCell>
                        <TableCell>Dimensions (MM)</TableCell>
                        <TableCell>Surface</TableCell>
                        <TableCell align="right">MRP (₹)</TableCell>
                        <TableCell align="right">Discount (%)</TableCell>
                        <TableCell align="right">Discounted Price (₹)</TableCell>
                      </>
                    )}
                    
                    {activeTab === 'adhesive' && (
                      <>
                        <TableCell>Category</TableCell>
                        <TableCell align="right">MRP (₹)</TableCell>
                        <TableCell align="right">D Price (₹)</TableCell>
                      </>
                    )}
                    
                    {activeTab === 'cp-sw' && (
                      <>
                        <TableCell>Product Code</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell align="right">MRP (₹)</TableCell>
                        <TableCell align="right">D Price (₹)</TableCell>
                      </>
                    )}
                    
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.sno}</TableCell>
                      <TableCell>{product.brand}</TableCell>
                      
                      {activeTab === 'tiles' && (
                        <>
                          <TableCell>{product.areaOfApplication}</TableCell>
                          <TableCell>{product.shadeName}</TableCell>
                          <TableCell>{product.dimensions}</TableCell>
                          <TableCell>{product.surface}</TableCell>
                          <TableCell align="right">{product.mrp}</TableCell>
                          <TableCell align="right">{product.discount}%</TableCell>
                          <TableCell align="right">{product.discountedPrice}</TableCell>
                        </>
                      )}
                      
                      {activeTab === 'adhesive' && (
                        <>
                          <TableCell>{product.category}</TableCell>
                          <TableCell align="right">{product.mrp}</TableCell>
                          <TableCell align="right">{product.dPrice}</TableCell>
                        </>
                      )}
                      
                      {activeTab === 'cp-sw' && (
                        <>
                          <TableCell>{product.productCode}</TableCell>
                          <TableCell>{product.description}</TableCell>
                          <TableCell align="right">{product.mrp}</TableCell>
                          <TableCell align="right">{product.dPrice}</TableCell>
                        </>
                      )}
                      
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Tooltip title="Edit">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => handleEditProduct(product)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title="Delete">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>
      
      {/* Add/Edit Product Dialog - Tiles Form */}
      <Dialog open={dialogOpen && activeTab === 'tiles'} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? `Add New ${getCategoryName().slice(0, -1)}` : `Edit ${getCategoryName().slice(0, -1)}`}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Brand"
                name="brand"
                value={tilesForm.brand}
                onChange={handleTilesFormChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Area of Application"
                name="areaOfApplication"
                value={tilesForm.areaOfApplication}
                onChange={handleTilesFormChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Shade Name"
                name="shadeName"
                value={tilesForm.shadeName}
                onChange={handleTilesFormChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Dimensions (MM)"
                name="dimensions"
                value={tilesForm.dimensions}
                onChange={handleTilesFormChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Surface"
                name="surface"
                value={tilesForm.surface}
                onChange={handleTilesFormChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="MRP (₹)"
                name="mrp"
                type="number"
                value={tilesForm.mrp}
                onChange={handleTilesFormChange}
                margin="normal"
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Discount (%)"
                name="discount"
                type="number"
                value={tilesForm.discount}
                onChange={handleTilesFormChange}
                margin="normal"
                InputProps={{ inputProps: { min: 0, max: 100 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Discounted Price (₹)"
                name="discountedPrice"
                type="number"
                value={tilesForm.discountedPrice}
                onChange={handleTilesFormChange}
                margin="normal"
                InputProps={{ inputProps: { min: 0 } }}
                disabled
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Area Required (Sq Feet)"
                name="areaRequired"
                type="number"
                value={tilesForm.areaRequired}
                onChange={handleTilesFormChange}
                margin="normal"
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="No of Boxes"
                name="noOfBoxes"
                type="number"
                value={tilesForm.noOfBoxes}
                onChange={handleTilesFormChange}
                margin="normal"
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Total Amount (₹)"
                name="totalAmount"
                type="number"
                value={tilesForm.totalAmount}
                margin="normal"
                InputProps={{ inputProps: { min: 0 } }}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<ImageIcon />}
              >
                Upload Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'tiles')}
                />
              </Button>
              {tilesForm.image && (
                <Box sx={{ mt: 2, maxWidth: '200px' }}>
                  <img src={tilesForm.image} alt="Tile Preview" style={{ width: '100%' }} />
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSaveProduct} variant="contained" color="primary">
            {dialogMode === 'add' ? 'Add' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Add/Edit Product Dialog - Adhesive Form */}
      <Dialog open={dialogOpen && activeTab === 'adhesive'} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? `Add New ${getCategoryName().slice(0, -1)}` : `Edit ${getCategoryName().slice(0, -1)}`}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Brand"
                name="brand"
                value={adhesiveForm.brand}
                onChange={handleAdhesiveFormChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Category"
                name="category"
                value={adhesiveForm.category}
                onChange={handleAdhesiveFormChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="MRP (₹)"
                name="mrp"
                type="number"
                value={adhesiveForm.mrp}
                onChange={handleAdhesiveFormChange}
                margin="normal"
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="D Price (₹)"
                name="dPrice"
                type="number"
                value={adhesiveForm.dPrice}
                onChange={handleAdhesiveFormChange}
                margin="normal"
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="No of Bags"
                name="noOfBags"
                type="number"
                value={adhesiveForm.noOfBags}
                onChange={handleAdhesiveFormChange}
                margin="normal"
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Total Amount (₹)"
                name="totalAmount"
                type="number"
                value={adhesiveForm.totalAmount}
                margin="normal"
                InputProps={{ inputProps: { min: 0 } }}
                disabled
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSaveProduct} variant="contained" color="primary">
            {dialogMode === 'add' ? 'Add' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Add/Edit Product Dialog - CP & SW Form */}
      <Dialog open={dialogOpen && activeTab === 'cp-sw'} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? `Add New ${getCategoryName().slice(0, -1)}` : `Edit ${getCategoryName().slice(0, -1)}`}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Brand"
                name="brand"
                value={cpswForm.brand}
                onChange={handleCpswFormChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Product Code"
                name="productCode"
                value={cpswForm.productCode}
                onChange={handleCpswFormChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={cpswForm.description}
                onChange={handleCpswFormChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="MRP (₹)"
                name="mrp"
                type="number"
                value={cpswForm.mrp}
                onChange={handleCpswFormChange}
                margin="normal"
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="D Price (₹)"
                name="dPrice"
                type="number"
                value={cpswForm.dPrice}
                onChange={handleCpswFormChange}
                margin="normal"
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nos"
                name="nos"
                type="number"
                value={cpswForm.nos}
                onChange={handleCpswFormChange}
                margin="normal"
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Total Amount (₹)"
                name="totalAmount"
                type="number"
                value={cpswForm.totalAmount}
                margin="normal"
                InputProps={{ inputProps: { min: 0 } }}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<ImageIcon />}
              >
                Upload Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'cp-sw')}
                />
              </Button>
              {cpswForm.image && (
                <Box sx={{ mt: 2, maxWidth: '200px' }}>
                  <img src={cpswForm.image} alt="CP & SW Preview" style={{ width: '100%' }} />
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSaveProduct} variant="contained" color="primary">
            {dialogMode === 'add' ? 'Add' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductManagement;
