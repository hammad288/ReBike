import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const RejectModal = ({ bike, onReject, onClose }) => {
    const RejectionSchema = Yup.object().shape({
        reason: Yup.string()
            .min(10, 'Reason must be at least 10 characters')
            .max(200, 'Reason must not exceed 200 characters')
            .required('Rejection reason is required'),
    });

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Reject Bike Listing</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <Formik
                        initialValues={{ reason: '' }}
                        validationSchema={RejectionSchema}
                        onSubmit={(values, { setSubmitting }) => {
                            onReject(bike._id, values.reason);
                            setSubmitting(false);
                        }}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <p className="text-muted mb-2">
                                            <strong>Brand:</strong> {bike.brand} {bike.model}
                                        </p>
                                        <p className="text-muted mb-2">
                                            <strong>Seller:</strong> {bike.seller?.name || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="reason" className="form-label">
                                            Rejection Reason <span className="text-danger">*</span>
                                        </label>
                                        <Field
                                            as="textarea"
                                            id="reason"
                                            name="reason"
                                            className="form-control"
                                            rows="4"
                                            placeholder="Please provide a reason for rejection..."
                                        />
                                        <ErrorMessage name="reason" component="div" className="text-danger small mt-1" />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={onClose}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-danger" disabled={isSubmitting}>
                                        {isSubmitting ? 'Rejecting...' : 'Reject Bike'}
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default RejectModal;
