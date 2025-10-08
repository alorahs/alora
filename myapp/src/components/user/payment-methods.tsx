import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { proxyApiRequest } from "@/lib/apiProxy";
import { User } from "@/interfaces/user";

interface PaymentMethod {
  _id?: string;
  type: string;
  provider?: string;
  lastFourDigits?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  billingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
}

interface PaymentMethodsProps {
  user: User | null;
}

export default function PaymentMethods({ user }: PaymentMethodsProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [newPaymentMethod, setNewPaymentMethod] = useState<Omit<PaymentMethod, "_id">>({
    type: "credit-card",
    isDefault: false,
    billingAddress: {},
  });

  // Fetch payment methods when component mounts
  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const response = await proxyApiRequest("/user-details", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.paymentMethods) {
          setPaymentMethods(data.paymentMethods);
        }
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    }
  };

  const handleAddPaymentMethod = async () => {
    setLoading(true);
    try {
      const response = await proxyApiRequest("/user-details/payment-methods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: newPaymentMethod,
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setPaymentMethods(data.paymentMethods);
        setNewPaymentMethod({
          type: "credit-card",
          isDefault: false,
          billingAddress: {},
        });
        toast({
          title: "Success",
          description: "Payment method added successfully",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add payment method");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to add payment method",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePaymentMethod = async (
    methodId: string,
    updates: Partial<PaymentMethod>
  ) => {
    setLoading(true);
    try {
      const response = await proxyApiRequest(
        `/user-details/payment-methods/${methodId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: updates,
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPaymentMethods(data.paymentMethods);
        toast({
          title: "Success",
          description: "Payment method updated successfully",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update payment method");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update payment method",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePaymentMethod = async (methodId: string) => {
    setLoading(true);
    try {
      const response = await proxyApiRequest(
        `/user-details/payment-methods/${methodId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPaymentMethods(data.paymentMethods);
        toast({
          title: "Success",
          description: "Payment method deleted successfully",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete payment method");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to delete payment method",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (methodId: string) => {
    handleUpdatePaymentMethod(methodId, { isDefault: true });
  };

  const getTypeDisplayName = (type: string) => {
    switch (type) {
      case "credit-card":
        return "Credit Card";
      case "debit-card":
        return "Debit Card";
      case "paypal":
        return "PayPal";
      case "bank-account":
        return "Bank Account";
      case "upi":
        return "UPI";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Methods
        </h2>
        <p className="text-gray-600 mb-6">
          Manage your payment methods for bookings.
        </p>
      </div>

      {/* Add New Payment Method */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Add New Payment Method
        </h3>
        <div className="space-y-4">
          <div>
            <Label
              htmlFor="paymentType"
              className="text-sm font-medium text-gray-700 mb-1 block"
            >
              Payment Type
            </Label>
            <Select
              value={newPaymentMethod.type}
              onValueChange={(value) =>
                setNewPaymentMethod({ ...newPaymentMethod, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit-card">Credit Card</SelectItem>
                <SelectItem value="debit-card">Debit Card</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="bank-account">Bank Account</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(newPaymentMethod.type === "credit-card" ||
            newPaymentMethod.type === "debit-card") && (
            <>
              <div>
                <Label
                  htmlFor="provider"
                  className="text-sm font-medium text-gray-700 mb-1 block"
                >
                  Provider
                </Label>
                <Input
                  id="provider"
                  value={newPaymentMethod.provider || ""}
                  onChange={(e) =>
                    setNewPaymentMethod({
                      ...newPaymentMethod,
                      provider: e.target.value,
                    })
                  }
                  placeholder="e.g., Visa, Mastercard"
                />
              </div>
              <div>
                <Label
                  htmlFor="lastFourDigits"
                  className="text-sm font-medium text-gray-700 mb-1 block"
                >
                  Last 4 Digits
                </Label>
                <Input
                  id="lastFourDigits"
                  value={newPaymentMethod.lastFourDigits || ""}
                  onChange={(e) =>
                    setNewPaymentMethod({
                      ...newPaymentMethod,
                      lastFourDigits: e.target.value,
                    })
                  }
                  placeholder="1234"
                  maxLength={4}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="expiryMonth"
                    className="text-sm font-medium text-gray-700 mb-1 block"
                  >
                    Expiry Month
                  </Label>
                  <Input
                    id="expiryMonth"
                    type="number"
                    value={newPaymentMethod.expiryMonth || ""}
                    onChange={(e) =>
                      setNewPaymentMethod({
                        ...newPaymentMethod,
                        expiryMonth: Number(e.target.value),
                      })
                    }
                    placeholder="MM"
                    min="1"
                    max="12"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="expiryYear"
                    className="text-sm font-medium text-gray-700 mb-1 block"
                  >
                    Expiry Year
                  </Label>
                  <Input
                    id="expiryYear"
                    type="number"
                    value={newPaymentMethod.expiryYear || ""}
                    onChange={(e) =>
                      setNewPaymentMethod({
                        ...newPaymentMethod,
                        expiryYear: Number(e.target.value),
                      })
                    }
                    placeholder="YYYY"
                    min={new Date().getFullYear()}
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1 block">
              Billing Address
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="street"
                  className="text-sm font-medium text-gray-700 mb-1 block"
                >
                  Street
                </Label>
                <Input
                  id="street"
                  value={newPaymentMethod.billingAddress?.street || ""}
                  onChange={(e) =>
                    setNewPaymentMethod({
                      ...newPaymentMethod,
                      billingAddress: {
                        ...newPaymentMethod.billingAddress,
                        street: e.target.value,
                      },
                    })
                  }
                  placeholder="Street address"
                />
              </div>
              <div>
                <Label
                  htmlFor="city"
                  className="text-sm font-medium text-gray-700 mb-1 block"
                >
                  City
                </Label>
                <Input
                  id="city"
                  value={newPaymentMethod.billingAddress?.city || ""}
                  onChange={(e) =>
                    setNewPaymentMethod({
                      ...newPaymentMethod,
                      billingAddress: {
                        ...newPaymentMethod.billingAddress,
                        city: e.target.value,
                      },
                    })
                  }
                  placeholder="City"
                />
              </div>
              <div>
                <Label
                  htmlFor="state"
                  className="text-sm font-medium text-gray-700 mb-1 block"
                >
                  State
                </Label>
                <Input
                  id="state"
                  value={newPaymentMethod.billingAddress?.state || ""}
                  onChange={(e) =>
                    setNewPaymentMethod({
                      ...newPaymentMethod,
                      billingAddress: {
                        ...newPaymentMethod.billingAddress,
                        state: e.target.value,
                      },
                    })
                  }
                  placeholder="State"
                />
              </div>
              <div>
                <Label
                  htmlFor="zip"
                  className="text-sm font-medium text-gray-700 mb-1 block"
                >
                  ZIP Code
                </Label>
                <Input
                  id="zip"
                  value={newPaymentMethod.billingAddress?.zip || ""}
                  onChange={(e) =>
                    setNewPaymentMethod({
                      ...newPaymentMethod,
                      billingAddress: {
                        ...newPaymentMethod.billingAddress,
                        zip: e.target.value,
                      },
                    })
                  }
                  placeholder="ZIP code"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="setDefault"
              checked={newPaymentMethod.isDefault}
              onChange={(e) =>
                setNewPaymentMethod({
                  ...newPaymentMethod,
                  isDefault: e.target.checked,
                })
              }
              className="rounded"
            />
            <Label htmlFor="setDefault" className="text-sm text-gray-700">
              Set as default payment method
            </Label>
          </div>

          <Button onClick={handleAddPaymentMethod} disabled={loading}>
            {loading ? "Adding..." : "Add Payment Method"}
          </Button>
        </div>
      </div>

      {/* Existing Payment Methods */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Your Payment Methods
        </h3>
        {paymentMethods.length === 0 ? (
          <p className="text-gray-500">No payment methods added yet.</p>
        ) : (
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div
                key={method._id}
                className={`bg-white rounded-lg shadow p-6 ${
                  method.isDefault ? "border-2 border-blue-500" : ""
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-semibold text-gray-900">
                        {getTypeDisplayName(method.type)}
                      </h4>
                      {method.isDefault && (
                        <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    {method.provider && (
                      <p className="text-gray-600">{method.provider}</p>
                    )}
                    {method.lastFourDigits && (
                      <p className="text-gray-600">
                        **** **** **** {method.lastFourDigits}
                      </p>
                    )}
                    {method.expiryMonth && method.expiryYear && (
                      <p className="text-gray-600">
                        Expires {method.expiryMonth}/{method.expiryYear}
                      </p>
                    )}
                    {method.billingAddress && (
                      <div className="text-gray-600 text-sm mt-2">
                        <p>{method.billingAddress.street}</p>
                        <p>
                          {method.billingAddress.city}, {method.billingAddress.state}{" "}
                          {method.billingAddress.zip}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    {!method.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => method._id && handleSetDefault(method._id)}
                      >
                        Set Default
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => method._id && handleDeletePaymentMethod(method._id)}
                      disabled={loading}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}