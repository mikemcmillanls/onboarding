'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { MapPin } from 'lucide-react';

const MOCK_ADDRESSES = [
  { street: '123 Main Street', city: 'New York', state: 'NY', zipCode: '10001' },
  { street: '456 Broadway', city: 'New York', state: 'NY', zipCode: '10012' },
  { street: '789 Park Avenue', city: 'New York', state: 'NY', zipCode: '10021' },
  { street: '321 5th Avenue', city: 'New York', state: 'NY', zipCode: '10016' },
  { street: '654 Madison Avenue', city: 'New York', state: 'NY', zipCode: '10022' },
  { street: '147 West 42nd Street', city: 'New York', state: 'NY', zipCode: '10036' },
  { street: '258 Lexington Avenue', city: 'New York', state: 'NY', zipCode: '10016' },
  { street: '369 Columbus Avenue', city: 'New York', state: 'NY', zipCode: '10024' },
  { street: '741 Amsterdam Avenue', city: 'New York', state: 'NY', zipCode: '10025' },
  { street: '852 Third Avenue', city: 'New York', state: 'NY', zipCode: '10022' },
  { street: '963 Second Avenue', city: 'New York', state: 'NY', zipCode: '10022' },
  { street: '159 First Avenue', city: 'New York', state: 'NY', zipCode: '10003' },
  { street: '321 Market Street', city: 'San Francisco', state: 'CA', zipCode: '94102' },
  { street: '654 Mission Street', city: 'San Francisco', state: 'CA', zipCode: '94105' },
  { street: '789 Howard Street', city: 'San Francisco', state: 'CA', zipCode: '94103' },
  { street: '147 Folsom Street', city: 'San Francisco', state: 'CA', zipCode: '94105' },
  { street: '258 Valencia Street', city: 'San Francisco', state: 'CA', zipCode: '94103' },
  { street: '369 Divisadero Street', city: 'San Francisco', state: 'CA', zipCode: '94117' },
  { street: '987 Sunset Boulevard', city: 'Los Angeles', state: 'CA', zipCode: '90028' },
  { street: '456 Wilshire Boulevard', city: 'Los Angeles', state: 'CA', zipCode: '90010' },
  { street: '789 Santa Monica Boulevard', city: 'Los Angeles', state: 'CA', zipCode: '90046' },
  { street: '147 Michigan Avenue', city: 'Chicago', state: 'IL', zipCode: '60601' },
  { street: '258 State Street', city: 'Chicago', state: 'IL', zipCode: '60605' },
  { street: '369 Wacker Drive', city: 'Chicago', state: 'IL', zipCode: '60606' },
  { street: '456 Boylston Street', city: 'Boston', state: 'MA', zipCode: '02116' },
  { street: '789 Newbury Street', city: 'Boston', state: 'MA', zipCode: '02116' },
  { street: '147 Commonwealth Avenue', city: 'Boston', state: 'MA', zipCode: '02116' },
  { street: '321 Peachtree Street', city: 'Atlanta', state: 'GA', zipCode: '30303' },
  { street: '654 Ponce de Leon Avenue', city: 'Atlanta', state: 'GA', zipCode: '30308' },
  { street: '456 6th Street', city: 'Austin', state: 'TX', zipCode: '78701' },
  { street: '789 Congress Avenue', city: 'Austin', state: 'TX', zipCode: '78701' },
  { street: '147 South Lamar Boulevard', city: 'Austin', state: 'TX', zipCode: '78704' },
  { street: '258 Pike Street', city: 'Seattle', state: 'WA', zipCode: '98101' },
  { street: '369 Broadway', city: 'Seattle', state: 'WA', zipCode: '98122' },
  { street: '741 15th Avenue East', city: 'Seattle', state: 'WA', zipCode: '98112' },
  { street: '456 SW Morrison Street', city: 'Portland', state: 'OR', zipCode: '97204' },
  { street: '789 NW 23rd Avenue', city: 'Portland', state: 'OR', zipCode: '97210' },
  { street: '147 SE Hawthorne Boulevard', city: 'Portland', state: 'OR', zipCode: '97214' },
];

interface MockAddressAutocompleteProps {
  onAddressSelect: (address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  }) => void;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
}

export function MockAddressAutocomplete({
  onAddressSelect,
  value,
  onChange,
  onBlur,
  placeholder,
  className,
}: MockAddressAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredAddresses, setFilteredAddresses] = useState(MOCK_ADDRESSES);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.length > 0) {
      const filtered = MOCK_ADDRESSES.filter((addr) =>
        `${addr.street} ${addr.city} ${addr.state} ${addr.zipCode}`
          .toLowerCase()
          .includes(value.toLowerCase())
      );
      setFilteredAddresses(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setFilteredAddresses(MOCK_ADDRESSES.slice(0, 8)); // Show first 8 when empty
      setIsOpen(false);
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectAddress = (address: typeof MOCK_ADDRESSES[0]) => {
    onChange(address.street);
    onAddressSelect(address);
    setIsOpen(false);
  };

  const handleFocus = () => {
    if (value.length === 0) {
      setFilteredAddresses(MOCK_ADDRESSES.slice(0, 8));
    }
    setIsOpen(true);
  };

  const handleBlur = () => {
    if (onBlur) {
      onBlur();
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder || 'Start typing your address...'}
        className={className}
        autoComplete="off"
      />

      {isOpen && filteredAddresses.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-64 overflow-auto">
          {filteredAddresses.slice(0, 10).map((address, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelectAddress(address)}
              className="w-full px-3 py-2.5 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0 flex items-start gap-2.5"
            >
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900">
                  {address.street}
                </div>
                <div className="text-xs text-gray-500">
                  {address.city}, {address.state} {address.zipCode}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {isOpen && filteredAddresses.length === 0 && value.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="px-4 py-3 text-sm text-gray-500 text-center">
            No addresses found
          </div>
        </div>
      )}
    </div>
  );
}
