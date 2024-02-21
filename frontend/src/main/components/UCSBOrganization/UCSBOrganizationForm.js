import { Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

function UCSBOrganizationForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialContents || {}, }
    );
    // Stryker restore all

    const navigate = useNavigate();

    // For explanation, see: https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
    // Note that even this complex regex may still need some tweaks

    // Stryker disable next-line Regex
    const inactive_regex = /(true|false)/i;

    // Stryker disable next-line all
    //const yyyyq_regex = /((19)|(20))\d{2}[1-4]/i; // Accepts from 1900-2099 followed by 1-4.  Close enough.

    return (

        <Form onSubmit={handleSubmit(submitAction)}>


            <Row>
            
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="orgCode">orgCode</Form.Label>
                        <Form.Control
                            data-testid="UCSBOrganizationForm-orgCode"
                            id="orgCode"
                            type="text"
                            isInvalid={Boolean(errors.orgTranslationShort)}
                            {...register("orgCode",{
                                required: "orgCode is required."
                            })}
                            //value={initialContents.orgCode}
                            
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.orgCode && 'orgCode is required. '}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                

                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="orgTranslationShort">orgTranslationShort</Form.Label>
                        <Form.Control
                            data-testid="UCSBOrganizationForm-orgTranslationShort"
                            id="orgTranslationShort"
                            type="text"
                            isInvalid={Boolean(errors.orgTranslationShort)}
                            {...register("orgTranslationShort", {
                                required: "orgTranslationShort is required."
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.orgTranslationShort && 'orgTranslationShort is required. '}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="orgTranslation">orgTranslation</Form.Label>
                        <Form.Control
                            data-testid="UCSBOrganizationForm-orgTranslation"
                            id="orgTranslation"
                            type="text"
                            isInvalid={Boolean(errors.orgTranslation)}
                            {...register("orgTranslation", {
                                required: "orgTranslation is required."
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.orgTranslation && 'orgTranslation is required. '}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>

                <Col>



                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="inactive">inactive</Form.Label>
                        <Form.Control
                            data-testid="UCSBOrganizationForm-inactive"
                            id="inactive"
                            type="text"
                            isInvalid={Boolean(errors.inactive)}
                            {...register("inactive", {
                                required: "inactive is required.",pattern: inactive_regex
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.inactive?.message && 'inactive is required. '}
                            {'The input should be just true or false'}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Button
                        type="submit"
                        data-testid="UCSBOrganizationForm-submit"
                    >
                        {buttonLabel}
                    </Button>
                    <Button
                        variant="Secondary"
                        onClick={() => navigate(-1)}
                        data-testid="UCSBOrganizationForm-cancel"
                    >
                        Cancel
                    </Button>
                </Col>
            </Row>
        </Form>

    )
}

export default UCSBOrganizationForm;