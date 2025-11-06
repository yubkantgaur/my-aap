import { useState } from 'react';

export default function App() {
  const API_URL = 'https://vernanbackend.ezlab.in/api/contact-us/';
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [statusText, setStatusText] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!emailRegex.test(form.email.trim())) errs.email = 'Enter a valid email';
    if (!form.phone.trim()) errs.phone = 'Phone is required';
    if (!form.message.trim()) errs.message = 'Message is required';
    return errs;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusText('');
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setSending(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.status === 200 || res.status === 201) {
        setStatusText('Form Submitted');
        setForm({ name: '', email: '', phone: '', message: '' });
      } else {
        setStatusText('Error: Please check API');
      }
    } catch (err) {
      setStatusText('Network error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 md:p-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Contact Us</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className="w-full border rounded-lg p-2"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full border rounded-lg p-2"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Enter your phone"
            className="w-full border rounded-lg p-2"
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Enter your message"
            rows="4"
            className="w-full border rounded-lg p-2"
          ></textarea>
          {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}

          <button
            type="submit"
            disabled={sending}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
          >
            {sending ? 'Sending...' : 'Submit'}
          </button>

          <input
            readOnly
            value={statusText}
            className="w-full border rounded-lg p-2 mt-2 bg-gray-50 text-center"
            placeholder="Status will appear here"
          />
        </form>
      </div>
    </div>
  );
}
