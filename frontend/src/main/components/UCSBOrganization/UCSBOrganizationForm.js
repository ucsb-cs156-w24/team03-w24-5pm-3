import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';

function UCSBOrganizationForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialContents || {}, }
    );
    const navigate = useNavigate();

    const testIdPrefix = "UCSBOrganizationForm";

    return (
        <Form onSubmit={handleSubmit(submitAction)}>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="orgCode">Organization Code</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-orgCode"}
                    id="orgCode"
                    type="text"
                {...register("orgCode", {
                    required: "Organization code is required.",
                    maxLength : {
                        value: 5,
                        message: "Max length 5 characters"
                    }
                })}
                />
            <Form.Control.Feedback type="invalid">
                {errors.orgCode?.message}
            </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="orgTranslationShort">Organization Translation (short)</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-orgTranslationShort"}
                    id="orgTranslationShort"
                    type="text"
                    isInvalid={Boolean(errors.orgTranslationShort)}
                    {...register("orgTranslationShort", {
                        required: "Shortened organization translation is required.",
                        maxLength : {
                            value: 50,
                            message: "Max length 50 characters"
                        }
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.orgTranslationShort?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="orgTranslation">Organization Translation</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-orgTranslation"}
                    id="orgTranslation"
                    type="text"
                    isInvalid={Boolean(errors.description)}
                    {...register("orgTranslation", {
                        required: "Organization translation is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.orgTranslation?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="inactive">Inactive</Form.Label>
                <Form.Check
                    data-testid={testIdPrefix + "-inactive"}
                    id="inactive"
                    type="checkbox"
                    {...register("inactive")}
                />
            </Form.Group>


            <Button
                type="submit"
                data-testid={testIdPrefix + "-submit"}
            >
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid={testIdPrefix + "-cancel"}
            >
                Cancel
            </Button>

        </Form>

    )
}

export default UCSBOrganizationForm; 