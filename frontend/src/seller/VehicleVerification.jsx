import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/auth';
import { verificationAPI } from '../services/apiService';
import compressImage from '../utils/compressImage';

/* ─── Inline styles ──────────────────────────────────────────────────── */
const S = {
    page: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
        paddingTop: '90px',
        paddingBottom: '60px',
    },
    card: {
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(18px)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        color: '#fff',
    },
    sectionTitle: {
        fontSize: '1rem',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: '#c084fc',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    label: {
        fontSize: '0.82rem',
        fontWeight: 600,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: '6px',
        display: 'block',
        letterSpacing: '0.04em',
    },
    input: {
        width: '100%',
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.18)',
        borderRadius: '10px',
        padding: '10px 14px',
        color: '#fff',
        fontSize: '0.92rem',
        outline: 'none',
        transition: 'border 0.2s, box-shadow 0.2s',
        marginBottom: 0,
    },
    inputFocus: {
        border: '1px solid #a855f7',
        boxShadow: '0 0 0 3px rgba(168,85,247,0.2)',
    },
    select: {
        width: '100%',
        background: 'rgba(30,20,60,0.9)',
        border: '1px solid rgba(255,255,255,0.18)',
        borderRadius: '10px',
        padding: '10px 14px',
        color: '#fff',
        fontSize: '0.92rem',
        outline: 'none',
    },
    divider: {
        height: '1px',
        background: 'rgba(255,255,255,0.1)',
        margin: '28px 0',
    },
    uploadBox: (hasImg, hasError) => ({
        border: `2px dashed ${hasError ? '#f87171' : hasImg ? '#a855f7' : 'rgba(255,255,255,0.25)'}`,
        borderRadius: '12px',
        padding: '18px 12px',
        textAlign: 'center',
        cursor: 'pointer',
        background: hasImg ? 'rgba(168,85,247,0.08)' : 'rgba(255,255,255,0.03)',
        transition: 'all 0.2s',
        position: 'relative',
    }),
    imgPreview: {
        width: '100%',
        height: '100px',
        objectFit: 'cover',
        borderRadius: '8px',
        marginTop: '8px',
    },
    errorText: {
        color: '#f87171',
        fontSize: '0.78rem',
        marginTop: '4px',
    },
    stepBar: {
        display: 'flex',
        gap: '8px',
        marginBottom: '32px',
    },
    stepDot: (active, done) => ({
        flex: 1,
        height: '5px',
        borderRadius: '4px',
        background: done ? '#a855f7' : active ? '#c084fc' : 'rgba(255,255,255,0.15)',
        transition: 'background 0.4s',
    }),
    declarationBox: {
        background: 'rgba(251,191,36,0.07)',
        border: '1px solid rgba(251,191,36,0.3)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
    },
    submitBtn: (disabled) => ({
        background: disabled
            ? 'rgba(168,85,247,0.3)'
            : 'linear-gradient(135deg, #7c3aed, #a855f7)',
        border: 'none',
        borderRadius: '12px',
        padding: '14px 36px',
        color: '#fff',
        fontWeight: 700,
        fontSize: '1rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
        width: '100%',
        letterSpacing: '0.04em',
        boxShadow: disabled ? 'none' : '0 4px 20px rgba(124,58,237,0.4)',
    }),
};

/* ─── Helpers ─────────────────────────────────────────────────────────── */
const STEPS = ['Owner Details', 'Documents', 'Bike Photos', 'Declaration'];

const GOVT_ID_TYPES = ['Aadhaar', 'PAN', 'Driving License'];

const initForm = () => ({
    ownerName: '',
    rcNumber: '',
    vehicleRegNumber: '',
    chassisNumber: '',
    engineNumber: '',
    vehicleBrand: '',
    vehicleModel: '',
    yearOfRegistration: '',
    govtIdType: 'Aadhaar',
    govtIdNumber: '',
    declarationAccepted: false,
});

/* ─── Component ───────────────────────────────────────────────────────── */
const VehicleVerification = () => {
    const { bikeId } = useParams();
    const navigate = useNavigate();
    const [auth] = useAuth();

    const [step, setStep] = useState(0);
    const [form, setForm] = useState(initForm());
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // Document image states
    const [imgs, setImgs] = useState({
        rcFront: null, rcBack: null,
        insuranceCert: null, pucCert: null,
        bikeFront: null, bikeBack: null,
        bikeLeft: null, bikeRight: null,
    });
    const [previews, setPreviews] = useState({});
    const [imgErrors, setImgErrors] = useState({});

    // Focus state for input glow
    const [focused, setFocused] = useState('');

    useEffect(() => { window.scrollTo(0, 0); }, [step]);

    /* ── Image Upload ── */
    const handleImageChange = async (key, file) => {
        if (!file) return;
        setImgErrors(prev => ({ ...prev, [key]: '' }));
        try {
            const maxPx = 1200;
            const quality = 0.78;
            const b64 = await compressImage(file, maxPx, quality);
            setImgs(prev => ({ ...prev, [key]: b64 }));
            setPreviews(prev => ({ ...prev, [key]: URL.createObjectURL(file) }));
        } catch {
            toast.error(`Failed to process ${key} image.`);
        }
    };

    /* ── Field change ── */
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    /* ── Validation per step ── */
    const validateStep = () => {
        const e = {};
        if (step === 0) {
            if (!form.ownerName.trim()) e.ownerName = 'Required';
            if (!form.rcNumber.trim()) e.rcNumber = 'Required';
            if (!form.vehicleRegNumber.trim()) e.vehicleRegNumber = 'Required';
            if (!form.chassisNumber.trim()) e.chassisNumber = 'Required';
            if (!form.engineNumber.trim()) e.engineNumber = 'Required';
            if (!form.vehicleBrand.trim()) e.vehicleBrand = 'Required';
            if (!form.vehicleModel.trim()) e.vehicleModel = 'Required';
            const yr = Number(form.yearOfRegistration);
            if (!form.yearOfRegistration || yr < 1980 || yr > new Date().getFullYear()) e.yearOfRegistration = 'Enter a valid year (1980–present)';
            if (!form.govtIdNumber.trim()) e.govtIdNumber = 'Required';
        }
        if (step === 1) {
            const ie = {};
            if (!imgs.rcFront) ie.rcFront = 'Required';
            if (!imgs.rcBack) ie.rcBack = 'Required';
            if (!imgs.insuranceCert) ie.insuranceCert = 'Required';
            setImgErrors(prev => ({ ...prev, ...ie }));
            if (Object.keys(ie).length) return false;
        }
        if (step === 2) {
            const ie = {};
            if (!imgs.bikeFront) ie.bikeFront = 'Required';
            if (!imgs.bikeBack) ie.bikeBack = 'Required';
            if (!imgs.bikeLeft) ie.bikeLeft = 'Required';
            if (!imgs.bikeRight) ie.bikeRight = 'Required';
            setImgErrors(prev => ({ ...prev, ...ie }));
            if (Object.keys(ie).length) return false;
        }
        if (step === 3 && !form.declarationAccepted) {
            e.declarationAccepted = 'You must accept the declaration to proceed.';
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const nextStep = () => {
        if (validateStep()) setStep(s => s + 1);
    };
    const prevStep = () => setStep(s => s - 1);

    /* ── Submit ── */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep()) return;

        setSubmitting(true);
        let token = auth?.token;
        if (!token) {
            try { token = JSON.parse(localStorage.getItem('auth'))?.token; } catch (_) {}
        }
        if (!token) {
            toast.error('Not logged in. Please login again.');
            setSubmitting(false);
            return;
        }

        const payload = {
            bike: bikeId,
            ...form,
            yearOfRegistration: Number(form.yearOfRegistration),
            ...imgs,
        };

        const result = await verificationAPI.submit(payload, token);
        if (result.success) {
            toast.success('✅ Documents submitted! Awaiting admin verification.');
            navigate('/dashboard/seller/my-bikes');
        } else {
            toast.error(result.message || 'Submission failed.');
        }
        setSubmitting(false);
    };

    /* ── Upload slot component ── */
    const UploadSlot = ({ fieldKey, label, required = true }) => {
        const inputRef = useRef();
        return (
            <div>
                <label style={S.label}>
                    {label} {required && <span style={{ color: '#f87171' }}>*</span>}
                    {!required && <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}> (optional)</span>}
                </label>
                <div
                    style={S.uploadBox(!!imgs[fieldKey], !!imgErrors[fieldKey])}
                    onClick={() => inputRef.current.click()}
                >
                    {previews[fieldKey] ? (
                        <>
                            <img src={previews[fieldKey]} alt={label} style={S.imgPreview} />
                            <div style={{ color: '#a855f7', fontSize: '0.8rem', marginTop: '6px' }}>
                                ✓ Uploaded — click to replace
                            </div>
                        </>
                    ) : (
                        <>
                            <div style={{ fontSize: '1.6rem', marginBottom: '4px' }}>📷</div>
                            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem' }}>
                                Click to upload {label}
                            </div>
                        </>
                    )}
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={ev => handleImageChange(fieldKey, ev.target.files[0])}
                    />
                </div>
                {imgErrors[fieldKey] && <div style={S.errorText}>⚠ {imgErrors[fieldKey]}</div>}
            </div>
        );
    };

    /* ── Field component ── */
    const Field = ({ name, label, placeholder, type = 'text' }) => (
        <div>
            <label style={S.label}>{label} <span style={{ color: '#f87171' }}>*</span></label>
            <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
                style={{
                    ...S.input,
                    ...(focused === name ? S.inputFocus : {}),
                    borderColor: errors[name] ? '#f87171' : undefined,
                }}
                onFocus={() => setFocused(name)}
                onBlur={() => setFocused('')}
            />
            {errors[name] && <div style={S.errorText}>⚠ {errors[name]}</div>}
        </div>
    );

    /* ── Render ── */
    return (
        <div style={S.page}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8 col-xl-7">

                        {/* Header */}
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📋</div>
                            <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '1.8rem', margin: 0 }}>
                                Vehicle Verification
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '6px', fontSize: '0.92rem' }}>
                                Your listing will be published after successful document verification.
                            </p>
                        </div>

                        <div style={S.card}>
                            {/* Step progress bar */}
                            <div style={S.stepBar}>
                                {STEPS.map((s, i) => (
                                    <div key={s} style={S.stepDot(i === step, i < step)} title={s} />
                                ))}
                            </div>
                            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginBottom: '28px', marginTop: '-20px' }}>
                                Step {step + 1} of {STEPS.length} — <span style={{ color: '#c084fc', fontWeight: 600 }}>{STEPS[step]}</span>
                            </div>

                            <form onSubmit={handleSubmit}>

                                {/* ─────────── STEP 0: Owner & Vehicle Details ─────────── */}
                                {step === 0 && (
                                    <>
                                        <div style={S.sectionTitle}>
                                            <span>👤</span> Owner Information
                                        </div>
                                        <div className="row g-3 mb-4">
                                            <div className="col-12">
                                                <Field name="ownerName" label="Owner Full Name (as per RC Book)" placeholder="e.g., Rahul Sharma" />
                                            </div>
                                            <div className="col-md-6">
                                                <label style={S.label}>Government ID Type <span style={{ color: '#f87171' }}>*</span></label>
                                                <select
                                                    name="govtIdType"
                                                    value={form.govtIdType}
                                                    onChange={handleChange}
                                                    style={S.select}
                                                >
                                                    {GOVT_ID_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                                </select>
                                            </div>
                                            <div className="col-md-6">
                                                <Field name="govtIdNumber" label="Government ID Number" placeholder="e.g., 1234 5678 9012" />
                                            </div>
                                        </div>

                                        <div style={S.divider} />

                                        <div style={S.sectionTitle}>
                                            <span>🏍️</span> Vehicle Details
                                        </div>
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <Field name="vehicleBrand" label="Vehicle Brand" placeholder="e.g., Honda, Yamaha" />
                                            </div>
                                            <div className="col-md-6">
                                                <Field name="vehicleModel" label="Vehicle Model" placeholder="e.g., CB Shine, FZ-S" />
                                            </div>
                                            <div className="col-md-6">
                                                <Field name="yearOfRegistration" label="Year of Registration" placeholder="e.g., 2019" type="number" />
                                            </div>
                                            <div className="col-md-6">
                                                <Field name="vehicleRegNumber" label="Vehicle Registration Number" placeholder="e.g., MH12AB1234" />
                                            </div>
                                            <div className="col-md-6">
                                                <Field name="rcNumber" label="RC Book / Registration Certificate No." placeholder="e.g., RC123456" />
                                            </div>
                                            <div className="col-md-6">
                                                <Field name="chassisNumber" label="Chassis Number" placeholder="e.g., ME4KC092DH8xxxxxx" />
                                            </div>
                                            <div className="col-12">
                                                <Field name="engineNumber" label="Engine Number" placeholder="e.g., KC09E8xxxxxx" />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* ─────────── STEP 1: Document Uploads ─────────── */}
                                {step === 1 && (
                                    <>
                                        <div style={S.sectionTitle}><span>📄</span> RC Book Photos</div>
                                        <div className="row g-3 mb-4">
                                            <div className="col-md-6">
                                                <UploadSlot fieldKey="rcFront" label="RC Book — Front Side" />
                                            </div>
                                            <div className="col-md-6">
                                                <UploadSlot fieldKey="rcBack" label="RC Book — Back Side" />
                                            </div>
                                        </div>

                                        <div style={S.divider} />

                                        <div style={S.sectionTitle}><span>📑</span> Other Certificates</div>
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <UploadSlot fieldKey="insuranceCert" label="Insurance Certificate" />
                                            </div>
                                            <div className="col-md-6">
                                                <UploadSlot fieldKey="pucCert" label="PUC Certificate" required={false} />
                                            </div>
                                        </div>

                                        <div style={{ marginTop: '16px', background: 'rgba(168,85,247,0.08)', borderRadius: '10px', padding: '12px 16px', fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)' }}>
                                            💡 Upload clear, well-lit photos. Documents must be fully legible. Images are compressed automatically.
                                        </div>
                                    </>
                                )}

                                {/* ─────────── STEP 2: Bike Photos ─────────── */}
                                {step === 2 && (
                                    <>
                                        <div style={S.sectionTitle}><span>📸</span> Clear Photos of the Bike</div>
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <UploadSlot fieldKey="bikeFront" label="Front View" />
                                            </div>
                                            <div className="col-md-6">
                                                <UploadSlot fieldKey="bikeBack" label="Back View" />
                                            </div>
                                            <div className="col-md-6">
                                                <UploadSlot fieldKey="bikeLeft" label="Left Side View" />
                                            </div>
                                            <div className="col-md-6">
                                                <UploadSlot fieldKey="bikeRight" label="Right Side View" />
                                            </div>
                                        </div>
                                        <div style={{ marginTop: '16px', background: 'rgba(168,85,247,0.08)', borderRadius: '10px', padding: '12px 16px', fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)' }}>
                                            💡 All 4 angles are required. Photos must show the complete bike without obstructions.
                                        </div>
                                    </>
                                )}

                                {/* ─────────── STEP 3: Declaration ─────────── */}
                                {step === 3 && (
                                    <>
                                        <div style={S.sectionTitle}><span>⚖️</span> Legal Declaration</div>

                                        <div style={S.declarationBox}>
                                            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.92rem', lineHeight: '1.7', marginBottom: '20px' }}>
                                                <strong style={{ color: '#fbbf24' }}>Declaration:</strong><br /><br />
                                                "I declare that I am the legal owner of this vehicle and all information provided is accurate and complete.
                                                I understand that submitting false information or listing a stolen vehicle may result in
                                                <strong> account suspension and legal action</strong> under applicable laws."
                                            </p>

                                            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                                                <input
                                                    type="checkbox"
                                                    name="declarationAccepted"
                                                    checked={form.declarationAccepted}
                                                    onChange={handleChange}
                                                    style={{ marginTop: '3px', accentColor: '#a855f7', width: '18px', height: '18px', flexShrink: 0 }}
                                                />
                                                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem' }}>
                                                    I have read and agree to the above declaration. I confirm that all uploaded documents and information are genuine.
                                                </span>
                                            </label>
                                            {errors.declarationAccepted && (
                                                <div style={{ ...S.errorText, marginTop: '10px' }}>⚠ {errors.declarationAccepted}</div>
                                            )}
                                        </div>

                                        {/* Summary */}
                                        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '16px 20px', border: '1px solid rgba(255,255,255,0.08)' }}>
                                            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginBottom: '10px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                                                Submission Summary
                                            </div>
                                            {[
                                                ['Owner', form.ownerName],
                                                ['RC Number', form.rcNumber],
                                                ['Reg. Number', form.vehicleRegNumber],
                                                ['Vehicle', `${form.vehicleBrand} ${form.vehicleModel} (${form.yearOfRegistration})`],
                                                ['Govt. ID', `${form.govtIdType} — ${form.govtIdNumber}`],
                                                ['Documents', [imgs.rcFront, imgs.rcBack, imgs.insuranceCert, imgs.pucCert].filter(Boolean).length + ' uploaded'],
                                                ['Bike Photos', [imgs.bikeFront, imgs.bikeBack, imgs.bikeLeft, imgs.bikeRight].filter(Boolean).length + ' / 4'],
                                            ].map(([k, v]) => (
                                                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.86rem' }}>
                                                    <span style={{ color: 'rgba(255,255,255,0.45)' }}>{k}</span>
                                                    <span style={{ color: '#e2e8f0', fontWeight: 500 }}>{v}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {/* ─────────── Navigation Buttons ─────────── */}
                                <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                                    {step > 0 && (
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            style={{
                                                flex: 1,
                                                background: 'rgba(255,255,255,0.07)',
                                                border: '1px solid rgba(255,255,255,0.15)',
                                                borderRadius: '12px',
                                                padding: '13px',
                                                color: '#fff',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                transition: 'background 0.2s',
                                            }}
                                        >
                                            ← Back
                                        </button>
                                    )}

                                    {step < STEPS.length - 1 ? (
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            style={{
                                                flex: 2,
                                                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                                                border: 'none',
                                                borderRadius: '12px',
                                                padding: '13px',
                                                color: '#fff',
                                                fontWeight: 700,
                                                fontSize: '1rem',
                                                cursor: 'pointer',
                                                boxShadow: '0 4px 20px rgba(124,58,237,0.35)',
                                                letterSpacing: '0.04em',
                                            }}
                                        >
                                            Continue →
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            style={S.submitBtn(submitting)}
                                        >
                                            {submitting ? '⏳ Submitting...' : '✅ Submit for Verification'}
                                        </button>
                                    )}
                                </div>

                                {/* Skip link */}
                                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                    <button
                                        type="button"
                                        onClick={() => navigate('/dashboard/seller/my-bikes')}
                                        style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', cursor: 'pointer', textDecoration: 'underline' }}
                                    >
                                        Skip for now (submit documents later from My Bikes)
                                    </button>
                                </div>

                            </form>
                        </div>

                        {/* Note */}
                        <div style={{ marginTop: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
                            🔒 Your documents are securely stored and only reviewed by the ReBike admin team.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleVerification;
