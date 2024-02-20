import { Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

function HelpRequestForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({ defaultValues: initialContents || {} });
    // Stryker restore all

    const navigate = useNavigate();
    const testIdPrefix = "HelpRequestForm";

    // Stryker disable next-line Regex
    const isodate_regex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;
    // Stryker disable next-line all
    const email_regex = /[A-Za-z0-9]+@[A-Za-z]{4,}/i; // Accepts at least 1 letter or number, followed by one '@', followed by at least 4 letters.
    const teamid_regex = /[a-z][0-9]{2}-[0-9](p|a)m-[1-4]/i;

    return (
        <Form onSubmit={handleSubmit(submitAction)}>
            <Row>
                {initialContents && (
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="id">Id</Form.Label>
                            <Form.Control
                                data-testid={testIdPrefix + "-id"}
                                id="id"
                                type="text"
                                {...register("id")}
                                value={initialContents.id}
                                disabled
                            />
                        </Form.Group>
                    </Col>
                )}

                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="RequesterEmail">Requester Email</Form.Label>
                        <Form.Control
                            data-testid={testIdPrefix + "-RequesterEmail"}
                            id="RequesterEmail"
                            type="text"
                            isInvalid={Boolean(errors.RequesterEmail)}
                            {...register("RequesterEmail", {
                                required: true,
                                pattern: email_regex
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.RequesterEmail && 'Requester Email is required. Requester Email must be a valid email.'}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="TeamId">Team ID</Form.Label>
                        <Form.Control
                            data-testid={testIdPrefix + "-TeamId"}
                            id="TeamId"
                            type="text"
                            isInvalid={Boolean(errors.TeamId)}
                            {...register("TeamId", {
                                required: true,
                                pattern: teamid_regex
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.TeamId && 'Team ID is required. Team ID must be a valid team id.'}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="TableOrBreakoutRoom">Table Or Breakout Room</Form.Label>
                        <Form.Control
                            data-testid={testIdPrefix + "-TableOrBreakoutRoom"}
                            id="TableOrBreakoutRoom"
                            type="text"
                            isInvalid={Boolean(errors.TableOrBreakoutRoom)}
                            {...register("TableOrBreakoutRoom", {
                                required: 'Table or Breakout Room is required.'
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.TableOrBreakoutRoom?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="RequestTime">Request Time</Form.Label>
                        <Form.Control
                            data-testid={testIdPrefix + "-RequestTime"}
                            id="RequestTime"
                            type="datetime-local"
                            isInvalid={Boolean(errors.RequestTime)}
                            {...register("RequestTime", {
                                required: true,
                                pattern: isodate_regex
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.RequestTime && 'Request Time is required and must be provided in ISO format.'}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="Explanation">Explanation</Form.Label>
                        <Form.Control
                            data-testid={testIdPrefix + "-Explanation"}
                            id="Explanation"
                            type="text"
                            isInvalid={Boolean(errors.Explanation)}
                            {...register("Explanation", {
                                required: "Explanation is required."
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.Explanation?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="Solved">Solved?</Form.Label>
                        <Form.Check
                            data-testid={testIdPrefix + "-Solved"}
                            id="Solved"
                            type="switch"
                            {...register("Solved")}
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Button
                        type="submit"
                        data-testid={testIdPrefix + "-Submit"}
                    >
                        {buttonLabel}
                    </Button>
                    <Button
                        variant="Secondary"
                        onClick={() => navigate(-1)}
                        data-testid={testIdPrefix + "-Cancel"}
                    >
                        Cancel
                    </Button>
                </Col>
            </Row>
        </Form>
    );
}

export default HelpRequestForm;
