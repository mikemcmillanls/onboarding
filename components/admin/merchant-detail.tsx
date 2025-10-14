'use client';

import { AdminMerchantRecord, formatTimeElapsed } from '@/lib/admin-mock-data';
import { CohortBadge } from './cohort-badge';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  CreditCard,
  Package,
  Users,
  Landmark,
} from 'lucide-react';

interface MerchantDetailProps {
  merchant: AdminMerchantRecord;
}

export function MerchantDetail({ merchant }: MerchantDetailProps) {
  const getStatusBadge = () => {
    const variants = {
      active: 'bg-green-100 text-green-800 border-green-300',
      stalled: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      completed: 'bg-blue-100 text-blue-800 border-blue-300',
      blocked: 'bg-red-100 text-red-800 border-red-300',
    };

    const labels = {
      active: 'Active',
      stalled: 'Stalled',
      completed: 'Completed',
      blocked: 'Blocked',
    };

    return (
      <Badge variant="outline" className={variants[merchant.status]}>
        {labels[merchant.status]}
      </Badge>
    );
  };

  const getKYBBadge = () => {
    const variants = {
      pending: 'bg-gray-100 text-gray-800 border-gray-300',
      approved: 'bg-green-100 text-green-800 border-green-300',
      review: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      rejected: 'bg-red-100 text-red-800 border-red-300',
    };

    return (
      <Badge variant="outline" className={variants[merchant.kybStatus]}>
        KYB: {merchant.kybStatus}
      </Badge>
    );
  };

  const getKYCBadge = () => {
    const variants = {
      pending: 'bg-gray-100 text-gray-800 border-gray-300',
      approved: 'bg-green-100 text-green-800 border-green-300',
      review: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      rejected: 'bg-red-100 text-red-800 border-red-300',
    };

    return (
      <Badge variant="outline" className={variants[merchant.kycStatus]}>
        KYC: {merchant.kycStatus}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white border rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {merchant.merchantName.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-black">{merchant.merchantName}</h1>
              <p className="text-gray-600 mt-1">ID: {merchant.id}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {getStatusBadge()}
            <CohortBadge cohort={merchant.cohort} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="flex flex-col">
            <span className="text-sm text-gray-600 mb-1">Current Step</span>
            <span className="text-lg font-semibold">Step {merchant.currentStep} of 4</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-600 mb-1">Progress</span>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-black h-2 rounded-full transition-all"
                  style={{ width: `${merchant.progressPercent}%` }}
                />
              </div>
              <span className="text-sm font-semibold">{merchant.progressPercent}%</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-600 mb-1">Started</span>
            <span className="text-lg font-semibold">{formatTimeElapsed(merchant.createdAt)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-600 mb-1">Last Activity</span>
            <span className="text-lg font-semibold">
              {formatTimeElapsed(merchant.lastActivity)}
            </span>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          {getKYBBadge()}
          {getKYCBadge()}
          {merchant.orderConfirmed && (
            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
              Order Confirmed
            </Badge>
          )}
          {merchant.hardwareShipped && (
            <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
              Hardware Shipped
            </Badge>
          )}
          {merchant.paymentsActive && (
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
              Payments Active
            </Badge>
          )}
        </div>
      </div>

      {/* Assigned Specialist */}
      {merchant.assignedSpecialist && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Assigned Specialist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="font-medium">{merchant.assignedSpecialist.name}</span>
                <Badge variant="outline">{merchant.assignedSpecialist.role}</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                {merchant.assignedSpecialist.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                {merchant.assignedSpecialist.phone}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 1: Sign Up Data */}
      {merchant.signUpData && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Account & Business Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Account Details */}
            <div>
              <h3 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                Account Details
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <p className="font-medium">
                    {merchant.signUpData.firstName} {merchant.signUpData.lastName}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <p className="font-medium">{merchant.signUpData.email}</p>
                </div>
                <div>
                  <span className="text-gray-600">Phone:</span>
                  <p className="font-medium">{merchant.signUpData.phone}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Business Details */}
            <div>
              <h3 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Business Details
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Business Name:</span>
                  <p className="font-medium">{merchant.signUpData.businessName}</p>
                </div>
                <div>
                  <span className="text-gray-600">Category:</span>
                  <p className="font-medium capitalize">{merchant.signUpData.businessCategory}</p>
                </div>
                <div>
                  <span className="text-gray-600">Revenue Range:</span>
                  <p className="font-medium">{merchant.signUpData.revenueRange}</p>
                </div>
                <div>
                  <span className="text-gray-600">Location Count:</span>
                  <p className="font-medium">{merchant.signUpData.locationCount}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Legal Details */}
            <div>
              <h3 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Legal Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Legal Business Name:</span>
                  <p className="font-medium">{merchant.signUpData.legalBusinessName}</p>
                </div>
                <div>
                  <span className="text-gray-600">Business Structure:</span>
                  <p className="font-medium capitalize">
                    {merchant.signUpData.businessStructure}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Tax ID:</span>
                  <p className="font-medium">{merchant.signUpData.taxId}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Business Address */}
            {merchant.signUpData.businessAddress && (
              <div>
                <h3 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Business Address
                </h3>
                <div className="text-sm">
                  <p className="font-medium">{merchant.signUpData.businessAddress.street}</p>
                  <p className="text-gray-600">
                    {merchant.signUpData.businessAddress.city},{' '}
                    {merchant.signUpData.businessAddress.state}{' '}
                    {merchant.signUpData.businessAddress.zipCode}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 2: POS Setup Data */}
      {merchant.posSetupData && (
        <Card>
          <CardHeader>
            <CardTitle>Step 2: POS Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Locations:</span>
                <p className="font-medium text-lg">{merchant.posSetupData.locations}</p>
              </div>
              <div>
                <span className="text-gray-600">Registers per Location:</span>
                <p className="font-medium text-lg">
                  {merchant.posSetupData.registersPerLocation}
                </p>
              </div>
              <div>
                <span className="text-gray-600">E-commerce:</span>
                <p className="font-medium text-lg">
                  {merchant.posSetupData.needsEcommerce ? 'Yes' : 'No'}
                </p>
              </div>
            </div>

            {merchant.posSetupData.hardwareBundles &&
              merchant.posSetupData.hardwareBundles.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Hardware Bundles Selected
                    </h3>
                    <div className="space-y-2">
                      {merchant.posSetupData.hardwareBundles.map((bundle, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <span className="font-medium capitalize">{bundle.bundleId} Bundle</span>
                          <span className="text-gray-600">Quantity: {bundle.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
          </CardContent>
        </Card>
      )}

      {/* Step 3: Checkout Data */}
      {merchant.checkoutData && (
        <Card>
          <CardHeader>
            <CardTitle>Step 3: Payment & Verification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Payment Method */}
            {merchant.checkoutData.paymentMethod && (
              <div>
                <h3 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Payment Method
                </h3>
                <div className="text-sm">
                  <p className="font-medium">{merchant.checkoutData.paymentMethod.cardNumber}</p>
                  <p className="text-gray-600">
                    Expires: {merchant.checkoutData.paymentMethod.expirationDate}
                  </p>
                </div>
              </div>
            )}

            <Separator />

            {/* Billing Address */}
            {merchant.checkoutData.billingAddress && (
              <div>
                <h3 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Billing Address
                </h3>
                <div className="text-sm">
                  <p className="font-medium">{merchant.checkoutData.billingAddress.street}</p>
                  <p className="text-gray-600">
                    {merchant.checkoutData.billingAddress.city},{' '}
                    {merchant.checkoutData.billingAddress.state}{' '}
                    {merchant.checkoutData.billingAddress.zipCode}
                  </p>
                </div>
              </div>
            )}

            {merchant.checkoutData.shippingAddresses &&
              merchant.checkoutData.shippingAddresses.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Shipping Addresses
                    </h3>
                    <div className="space-y-3">
                      {merchant.checkoutData.shippingAddresses.map((address, idx) => (
                        <div key={idx} className="p-3 bg-gray-50 rounded-lg text-sm">
                          <p className="font-medium mb-1">{address.locationName}</p>
                          <p className="text-gray-600">{address.street}</p>
                          <p className="text-gray-600">
                            {address.city}, {address.state} {address.zipCode}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

            <Separator />

            {/* Identity Verification */}
            <div>
              <h3 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                Business Representative
              </h3>
              <div className="p-3 bg-gray-50 rounded-lg text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">
                    {merchant.checkoutData.identityVerification.businessRepresentative.fullName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Role:</span>
                  <span className="font-medium">
                    {merchant.checkoutData.identityVerification.businessRepresentative.role}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">DOB:</span>
                  <span className="font-medium">
                    {merchant.checkoutData.identityVerification.businessRepresentative.dateOfBirth}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">SSN (Last 4):</span>
                  <span className="font-medium">
                    {merchant.checkoutData.identityVerification.businessRepresentative.ssnLast4}
                  </span>
                </div>
              </div>
            </div>

            {merchant.checkoutData.identityVerification.businessOwners &&
              merchant.checkoutData.identityVerification.businessOwners.length > 0 && (
                <>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Business Owners
                    </h3>
                    <div className="space-y-3">
                      {merchant.checkoutData.identityVerification.businessOwners.map(
                        (owner, idx) => (
                          <div key={idx} className="p-3 bg-gray-50 rounded-lg text-sm space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Name:</span>
                              <span className="font-medium">{owner.fullName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Ownership:</span>
                              <span className="font-medium">{owner.ownershipPercent}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Role:</span>
                              <span className="font-medium">{owner.role}</span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </>
              )}
          </CardContent>
        </Card>
      )}

      {/* Step 4: Bank Account Data */}
      {merchant.bankAccountData && (
        <Card>
          <CardHeader>
            <CardTitle>Step 4: Bank Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
                <Landmark className="w-4 h-4" />
                Payout Bank Account
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Account Holder:</span>
                  <p className="font-medium">{merchant.bankAccountData.accountHolderName}</p>
                </div>
                <div>
                  <span className="text-gray-600">Bank Name:</span>
                  <p className="font-medium">{merchant.bankAccountData.bankName}</p>
                </div>
                <div>
                  <span className="text-gray-600">Routing Number:</span>
                  <p className="font-medium">{merchant.bankAccountData.routingNumber}</p>
                </div>
                <div>
                  <span className="text-gray-600">Account Number:</span>
                  <p className="font-medium">{merchant.bankAccountData.accountNumber}</p>
                </div>
                <div>
                  <span className="text-gray-600">Account Type:</span>
                  <p className="font-medium capitalize">{merchant.bankAccountData.accountType}</p>
                </div>
                <div>
                  <span className="text-gray-600">Payouts:</span>
                  <Badge
                    variant="outline"
                    className={
                      merchant.payoutsEnabled
                        ? 'bg-green-100 text-green-800 border-green-300'
                        : 'bg-gray-100 text-gray-800 border-gray-300'
                    }
                  >
                    {merchant.payoutsEnabled ? 'Enabled' : 'Pending Verification'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
