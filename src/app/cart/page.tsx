'use client';

import { Button } from '@/components/Button';
import { useCart } from '@/context/CartContext';
import { Ticket } from '@/types';
import Big from 'big.js';
import { Delete } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { tickets, removeTicket } = useCart();

  const subTotal = tickets.reduce(
    (total, item) => total.plus(Big(item.price).times(item.unitAmount)),
    Big('0.0')
  );

  return (
    <div className="flex flex-col px-12 py-4 gap-4">
      <text className="text-3xl">Shopping Cart</text>
      <div className="flex justify-between">
        <div className="flex flex-col w-full max-w-xl gap-5">
          {tickets.map((ticket) => (
            <div
              key={`${ticket.eventId}:${ticket.label}`}
              className="flex flex-col"
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <p>{ticket.eventTitle}</p>
                  <p>${ticket.price.toString()}</p>
                </div>
                <div className="flex gap-5">
                  <p>{ticket.unitAmount}</p>
                  <p>{ticket.label}</p>
                </div>

                <Button
                  variant="ghost"
                  onClick={() => removeTicket(ticket.eventId, ticket.label)}
                >
                  <Delete />
                </Button>
              </div>
              <hr />
            </div>
          ))}
        </div>
        <div className="flex flex-col max-w-md w-full">
          <p>Order Summary</p>
          <hr />
          <div className="flex justify-between">
            <p>Order Total </p>
            <p>${subTotal.toFixed(2)}</p>
          </div>

          <Link href="/checkout">
            <Button>Checkout</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
