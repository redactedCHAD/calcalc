import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../utils/AuthContext';
import { lookupFoodByUPC } from '../utils/nutritionIxApi';

export default function Scan() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const videoRef = useRef(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [scannedCode, setScannedCode] = useState('');
  const [foodData, setFoodData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if user is authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  // Check for camera availability
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
      setHasCamera(true);
    }
  }, []);

  const startCamera = async () => {
    if (!hasCamera) {
      setError('Camera not available on this device or browser');
      return;
    }

    try {
      setError(null);
      
      const constraints = {
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Could not access camera. Please check permissions.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  // Function for barcode scanning (using mock for now, would be integrated with a real library)
  const scanBarcode = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would use a barcode scanning library
      // For now, we'll simulate finding a barcode
      const mockUpc = '049000000443'; // Sample UPC (Coca-Cola)
      setScannedCode(mockUpc);
      
      // Look up the food data using our NutritionIx API utility
      const data = await lookupFoodByUPC(mockUpc);
      setFoodData(data);
    } catch (err) {
      console.error('Error scanning barcode:', err);
      setError(err.message || 'Error scanning barcode');
    } finally {
      setLoading(false);
    }
  };

  // Function for testing other UPC codes
  const testOtherUpc = async (upc) => {
    setLoading(true);
    setError(null);
    
    try {
      setScannedCode(upc);
      const data = await lookupFoodByUPC(upc);
      setFoodData(data);
    } catch (err) {
      console.error('Error fetching UPC data:', err);
      setError(err.message || 'Error fetching product data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToJournal = () => {
    // Store the scanned item in localStorage to pass it to the journal page
    if (foodData) {
      localStorage.setItem('lastScannedFood', JSON.stringify(foodData));
      router.push('/journal');
    }
  };

  if (authLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="card p-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">Barcode Scanner</h1>
      <p className="text-neutral mb-6">
        Scan a food barcode to quickly add items to your journal
      </p>

      <div className="card p-6 mb-6">
        <div className="relative">
          {hasCamera && (
            <div className="mb-4 relative bg-black rounded-lg overflow-hidden">
              <video 
                ref={videoRef}
                className="w-full h-64 md:h-96 object-cover"
              />
              
              {/* Scanning frame overlay */}
              {cameraActive && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="border-2 border-primary w-4/5 h-1/2 rounded-lg flex items-center justify-center">
                    <div className="text-white text-shadow text-sm">
                      Center barcode here
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {!hasCamera && (
            <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
              <p className="text-neutral text-center p-6">
                Camera access is not available on this device or browser.
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-alert p-3 rounded-md mt-4">
              {error}
            </div>
          )}

          <div className="flex flex-wrap gap-3 mt-4">
            {!cameraActive ? (
              <button
                onClick={startCamera}
                disabled={!hasCamera || loading}
                className={`btn-primary ${(!hasCamera || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Loading...' : 'Start Camera'}
              </button>
            ) : (
              <>
                <button
                  onClick={stopCamera}
                  disabled={loading}
                  className={`btn bg-gray-500 text-white ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Stop Camera
                </button>
                <button
                  onClick={scanBarcode}
                  disabled={loading}
                  className={`btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Scanning...' : 'Scan Barcode'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Test buttons for different UPC codes */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Test with Sample Barcodes</h2>
        <p className="text-neutral mb-4">
          Since we can't scan real barcodes in this environment, you can test with these sample UPC codes:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button 
            onClick={() => testOtherUpc('049000000443')}
            disabled={loading}
            className="btn bg-gray-100 hover:bg-gray-200 text-gray-800"
          >
            Coca-Cola (049000000443)
          </button>
          <button 
            onClick={() => testOtherUpc('021130126026')}
            disabled={loading}
            className="btn bg-gray-100 hover:bg-gray-200 text-gray-800"
          >
            Cheerios (021130126026)
          </button>
          <button 
            onClick={() => testOtherUpc('884912129161')}
            disabled={loading}
            className="btn bg-gray-100 hover:bg-gray-200 text-gray-800"
          >
            Kind Bar (884912129161)
          </button>
        </div>
      </div>

      {scannedCode && (
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">Scan Result</h2>
          <p className="mb-2">
            <span className="font-medium">Barcode:</span> {scannedCode}
          </p>
          
          {loading && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
        </div>
      )}

      {foodData && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Food Information</h2>
          
          <div className="space-y-2 mb-6">
            <p className="text-lg font-medium">{foodData.food_name}</p>
            {foodData.brand_name && (
              <p className="text-neutral">{foodData.brand_name}</p>
            )}
            <p>
              <span className="font-medium">Serving:</span> {foodData.serving_qty} {foodData.serving_unit}
              {foodData.serving_weight_grams && ` (${foodData.serving_weight_grams}g)`}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-gray-50 rounded-md">
              <div className="text-xl font-bold">{foodData.calories}</div>
              <div className="text-sm text-neutral">Calories</div>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-md">
              <div className="text-xl font-bold">{foodData.protein}g</div>
              <div className="text-sm text-neutral">Protein</div>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-md">
              <div className="text-xl font-bold">{foodData.total_carbohydrate}g</div>
              <div className="text-sm text-neutral">Carbs</div>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-md">
              <div className="text-xl font-bold">{foodData.total_fat}g</div>
              <div className="text-sm text-neutral">Fat</div>
            </div>
          </div>
          
          <button
            onClick={handleAddToJournal}
            className="btn-primary w-full"
          >
            Add to Journal
          </button>
        </div>
      )}
    </div>
  );
} 