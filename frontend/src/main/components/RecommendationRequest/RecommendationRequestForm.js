import { Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

function RecommendationRequestForm({ initialContents, submitAction, buttonLabel = "Create" }) {

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

    // Stryker disable next-line Regex UCSB DATES HERITAGE to process the date
    const isodate_regex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;
    //Email Regex processor
    const email_regex = /[a-z0-9]+@[a-z]+.[a-z]{2,3}/;

    // Stryker disable next-line all MORE LEGACY CODE
    //const yyyyq_regex = /((19)|(20))\d{2}[1-4]/i; // Accepts from 1900-2099 followed by 1-4.  Close enough.

    return (

        <Form onSubmit={handleSubmit(submitAction)}>


            <Row>

                {initialContents && (
                    <Col>
                        <Form.Group className="mb-3" >
                            <Form.Label htmlFor="id">Id</Form.Label>
                            <Form.Control
                                data-testid="RecommendationRequestForm-id"
                                id="id"
                                type="text"
                                {...register("id")}
                                value={initialContents.id}
                                disabled
                            />
                        </Form.Group>
                    </Col>
                )}

                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="requesterEmail">Requester Email</Form.Label>
                        <Form.Control
                            data-testid="RecommendationRequestForm-requesterEmail"
                            id="requesterEmail"
                            type="text"
                            isInvalid={Boolean(errors.requesterEmail)}
                            {...register("requesterEmail", {required: "Requester email is required.", pattern: email_regex})}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.requesterEmail?.message}
                            {errors.requesterEmail?.type === 'pattern' && 'Requester email must be a valid email address.'}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="professorEmail">Professor Email</Form.Label>
                        <Form.Control
                            data-testid="RecommendationRequestForm-professorEmail"
                            id="professorEmail"
                            type="text"
                            isInvalid={Boolean(errors.professorEmail)}
                            {...register("professorEmail", {required: "Professor email is required.", pattern: email_regex})}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.professorEmail?.message}
                            {errors.professorEmail?.type === 'pattern' && 'Professor email must be a valid email address.'}
                        </Form.Control.Feedback>
                    </Form.Group>

                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="explanation">Explanation</Form.Label>
                    <Form.Control
                        data-testid={"RecommendationRequestForm-explanation"}
                        id="explanation"
                        type="text"
                        isInvalid={Boolean(errors.explanation)}
                        {...register("explanation", {
                            required: "Explanation is required."
                        })}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.explanation?.message}
                    </Form.Control.Feedback>
                </Form.Group>

                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="dateRequested">Date Requested(iso format)</Form.Label>
                        <Form.Control
                            data-testid="RecommendationRequestForm-dateRequested"
                            id="dateRequested"
                            type="datetime-local"
                            isInvalid={Boolean(errors.dateRequested)}
                            {...register("dateRequested", { required: true, pattern: isodate_regex })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.dateRequested && 'Date Requested is required in ISO format.'}
                        </Form.Control.Feedback>
                    </Form.Group>

                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="dateNeeded">Date Requested(iso format)</Form.Label>
                    <Form.Control
                        data-testid="RecommendationRequestForm-dateNeeded"
                        id="dateNeeded"
                        type="datetime-local"
                        isInvalid={Boolean(errors.dateNeeded)}
                        {...register("dateNeeded", { required: true, pattern: isodate_regex })}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.dateNeeded && 'Date Needed is required in ISO format.'}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="done">Done?(iso format)</Form.Label>
                    <Form.Control
                        data-testid="RecommendationRequestForm-done"
                        id="done"
                        type="switch"
                        isInvalid={Boolean(errors.done)}
                        {...register("done", {})}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.done?.message}
                    </Form.Control.Feedback>
                </Form.Group>

            </Row>

            <Row>
                <Col>
                    <Button
                        type="submit"
                        data-testid="RecommendationRequestForm-submit"
                    >
                        {buttonLabel}
                    </Button>
                    <Button
                        variant="Secondary"
                        onClick={() => navigate(-1)}
                        data-testid="RecommendationRequestForm-cancel"
                    >
                        Cancel
                    </Button>
                </Col>
            </Row>
        </Form>

    )
}

export default RecommendationRequestForm;
