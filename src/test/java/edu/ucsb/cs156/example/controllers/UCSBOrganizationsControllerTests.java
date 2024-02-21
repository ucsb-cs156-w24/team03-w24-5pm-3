
import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.entities.UCSBOrganization;
import edu.ucsb.cs156.example.repositories.UCSBOrganizationRepository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;


@WebMvcTest(controllers = UCSBOrganizationController.class)
@Import(TestConfig.class)
public class UCSBOrganizationControllerTests extends ControllerTestCase {
   
    @MockBean
    UCSBOrganizationRepository ucsbOrganizationRepository;

    @MockBean
    UserRepository userRepository;

    // Tests for GET /api/ucsborganization/all

    @Test
    public void logged_out_users_cannot_get_all() throws Exception {
            mockMvc.perform(get("/api/ucsborganization/all"))
                            .andExpect(status().is(403)); // logged out users can't get all
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void logged_in_users_can_get_all() throws Exception {
            mockMvc.perform(get("/api/ucsborganization/all"))
                            .andExpect(status().is(200)); // logged
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void test_that_logged_in_user_can_get_by_id_when_the_id_does_not_exist() throws Exception {

            // arrange

            when(ucsbOrganizationRepository.findById(eq("TASA"))).thenReturn(Optional.empty());

            // act
            MvcResult response = mockMvc.perform(get("/api/ucsborganization?orgCode=TASA"))
                            .andExpect(status().isNotFound()).andReturn();

            // assert

            verify(ucsbOrganizationRepository, times(1)).findById(eq("TASA"));
            Map<String, Object> json = responseToJson(response);
            assertEquals("EntityNotFoundException", json.get("type"));
            assertEquals("UCSBOrganization with id TASA not found", json.get("message"));
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void logged_in_user_can_get_all_organization() throws Exception {

            // arrange

            UCSBOrganization zetaPhiRho = UCSBOrganization.builder()
                            .orgCode("ZPR")
                            .orgTranslationShort("ZETA PHI RHO")
                            .orgTranslation("ZETA PHI RHO")
                            .inactive(false)
                            .build();

            UCSBOrganization skydiving = UCSBOrganization.builder()
                            .orgCode("SKY")
                            .orgTranslationShort("SKYDIVING CLUB")
                            .orgTranslation("SKYDIVING CLUB AT UCSB")
                            .inactive(false)
                            .build();

            UCSBOrganization studentLife = UCSBOrganization.builder()
                            .orgCode("OSLI")
                            .orgTranslationShort("STUDENT LIFE")
                            .orgTranslation("OFFICE OF STUDENT LIFE")
                            .inactive(false)
                            .build();

            UCSBOrganization koreanRadio = UCSBOrganization.builder()
                            .orgCode("KRC")
                            .orgTranslationShort("KOREAN RADIO CL")
                            .orgTranslation("KOREAN RADIO CLUB")
                            .inactive(false)
                            .build();

            ArrayList<UCSBOrganization> expectedOrganization = new ArrayList<>();
            expectedOrganization.addAll(Arrays.asList(zetaPhiRho, skydiving, studentLife, koreanRadio));

            when(ucsbOrganizationRepository.findAll()).thenReturn(expectedOrganization);

            // act
            MvcResult response = mockMvc.perform(get("/api/ucsborganization/all"))
                            .andExpect(status().isOk()).andReturn();

            // assert

            verify(ucsbOrganizationRepository, times(1)).findAll();
            String expectedJson = mapper.writeValueAsString(expectedOrganization);
            String responseString = response.getResponse().getContentAsString();
            assertEquals(expectedJson, responseString);
    }

    // Tests for POST /api/ucsborganization...

    @Test
    public void logged_out_users_cannot_post() throws Exception {
            mockMvc.perform(post("/api/ucsborganization/post"))
                            .andExpect(status().is(403));
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void logged_in_regular_users_cannot_post() throws Exception {
            mockMvc.perform(post("/api/ucsborganization/post"))
                            .andExpect(status().is(403)); // only admins can post
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void an_admin_user_can_post_a_new_organization() throws Exception {
            // arrange

            UCSBOrganization csu = UCSBOrganization.builder()
                            .orgCode("CSU")
                            .orgTranslationShort("CHINESE STU UN")
                            .orgTranslation("CHINESE STUDENT UNION")
                            .inactive(false)
                            .build();

            when(ucsbOrganizationRepository.save(eq(csu))).thenReturn(csu);

            // act
            MvcResult response = mockMvc.perform(
                            post("/api/ucsborganization/post?orgCode=CSU&orgTranslationShort=CHINESE STU UN&orgTranslation=CHINESE STUDENT UNION&inactive=false")
                                            .with(csrf()))
                            .andExpect(status().isOk()).andReturn();

            // assert
            verify(ucsbOrganizationRepository, times(1)).save(csu);
            String expectedJson = mapper.writeValueAsString(csu);
            String responseString = response.getResponse().getContentAsString();
            assertEquals(expectedJson, responseString);
    }

    // Tests for GET /api/ucsborganization?...

    @Test
    public void logged_out_users_cannot_get_by_id() throws Exception {
            mockMvc.perform(get("/api/ucsborganization?orgCode=ZPR"))
                            .andExpect(status().is(403)); // logged out users can't get by id
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {

            // arrange

            UCSBOrganization organization = UCSBOrganization.builder()
                            .orgCode("ZPR")
                            .orgTranslationShort("ZETA PHI RHO")
                            .orgTranslation("ZETA PHI RHO")
                            .inactive(false)
                            .build();

            when(ucsbOrganizationRepository.findById(eq("ZPR"))).thenReturn(Optional.of(organization));

            // act
            MvcResult response = mockMvc.perform(get("/api/ucsborganization?orgCode=ZPR"))
                            .andExpect(status().isOk()).andReturn();

            // assert

            verify(ucsbOrganizationRepository, times(1)).findById(eq("ZPR"));
            String expectedJson = mapper.writeValueAsString(organization);
            String responseString = response.getResponse().getContentAsString();
            assertEquals(expectedJson, responseString);
    }

    // Tests for PUT /api/ucsborganization?...

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void admin_can_edit_an_existing_organization() throws Exception {
            // arrange

            UCSBOrganization zetaPhiRhoOrig = UCSBOrganization.builder()
                            .orgCode("ZPR")
                            .orgTranslationShort("ZETA PHI RHO")
                            .orgTranslation("ZETA PHI RHO")
                            .inactive(false)
                            .build();

            UCSBOrganization zetaPhiRhoEdited = UCSBOrganization.builder()
                            .orgCode("ZPR")
                            .orgTranslationShort("ZETAS")
                            .orgTranslation("ZETA PHI RHOS")
                            .inactive(true)
                            .build();

            String requestBody = mapper.writeValueAsString(zetaPhiRhoEdited);

            when(ucsbOrganizationRepository.findById(eq("ZPR"))).thenReturn(Optional.of(zetaPhiRhoOrig));

            // act
            MvcResult response = mockMvc.perform(
                            put("/api/ucsborganization?orgCode=ZPR")
                                            .contentType(MediaType.APPLICATION_JSON)
                                            .characterEncoding("utf-8")
                                            .content(requestBody)
                                            .with(csrf()))
                            .andExpect(status().isOk()).andReturn();

            // assert
            verify(ucsbOrganizationRepository, times(1)).findById("ZPR");
            verify(ucsbOrganizationRepository, times(1)).save(zetaPhiRhoEdited); // should be saved with updated info
            String responseString = response.getResponse().getContentAsString();
            assertEquals(requestBody, responseString);
    }


    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void admin_cannot_edit_organization_that_does_not_exist() throws Exception {
            // arrange

            UCSBOrganization editedOrg = UCSBOrganization.builder()
                            .orgCode("TASA")
                            .orgTranslationShort("TAI AMER STU ASSC")
                            .orgTranslation("TAIWANESE AMERICAN STUDENT ASSOCIATION")
                            .inactive(false)
                            .build();

            String requestBody = mapper.writeValueAsString(editedOrg);

            when(ucsbOrganizationRepository.findById(eq("TASA"))).thenReturn(Optional.empty());

            // act
            MvcResult response = mockMvc.perform(
                            put("/api/ucsborganization?orgCode=TASA")
                                            .contentType(MediaType.APPLICATION_JSON)
                                            .characterEncoding("utf-8")
                                            .content(requestBody)
                                            .with(csrf()))
                            .andExpect(status().isNotFound()).andReturn();

            // assert
            verify(ucsbOrganizationRepository, times(1)).findById("TASA");
            Map<String, Object> json = responseToJson(response);
            assertEquals("UCSBOrganization with id TASA not found", json.get("message"));

    }

    // Tests for DELETE /api/ucsborganization?...

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void admin_can_delete_a_date() throws Exception {
            // arrange

            UCSBOrganization zetaPhiRho = UCSBOrganization.builder()
                            .orgCode("ZPR")
                            .orgTranslationShort("ZETA PHI RHO")
                            .orgTranslation("ZETA PHI RHO")
                            .inactive(false)
                            .build();

            when(ucsbOrganizationRepository.findById(eq("ZPR"))).thenReturn(Optional.of(zetaPhiRho));

            // act
            MvcResult response = mockMvc.perform(
                            delete("/api/ucsborganization?orgCode=ZPR")
                                            .with(csrf()))
                            .andExpect(status().isOk()).andReturn();

            // assert
            verify(ucsbOrganizationRepository, times(1)).findById("ZPR");
            verify(ucsbOrganizationRepository, times(1)).delete(any());

            Map<String, Object> json = responseToJson(response);
            assertEquals("UCSBOrganization with id ZPR deleted", json.get("message"));
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void admin_tries_to_delete_non_existant_organization_and_gets_right_error_message()
                    throws Exception {
            // arrange

            when(ucsbOrganizationRepository.findById(eq("TASA"))).thenReturn(Optional.empty());

            // act
            MvcResult response = mockMvc.perform(
                            delete("/api/ucsborganization?orgCode=TASA")
                                            .with(csrf()))
                            .andExpect(status().isNotFound()).andReturn();

            // assert
            verify(ucsbOrganizationRepository, times(1)).findById("TASA");
            Map<String, Object> json = responseToJson(response);
            assertEquals("UCSBOrganization with id TASA not found", json.get("message"));
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void admin_can_post_inactive_organization() throws Exception {
        // arrange
        UCSBOrganization vsa = UCSBOrganization.builder()
                .orgCode("VSA")
                .orgTranslationShort("Viet Stu Assc")
                .orgTranslation("Vietnamese Student Association")
                .inactive(true)
                .build();

        when(ucsbOrganizationRepository.save(eq(vsa))).thenReturn(vsa);

        // act
        MvcResult response = mockMvc.perform(
                post("/api/ucsborganization/post?orgCode=VSA&orgTranslationShort=Viet Stu Assc&orgTranslation=Vietnamese Student Association&inactive=true")
                        .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        // assert
        verify(ucsbOrganizationRepository, times(1)).save(vsa);
        String expectedJson = mapper.writeValueAsString(vsa);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
        }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void admin_can_update_orgcode() throws Exception {
        // arrange

        UCSBOrganization zetaPhiRhoOrig = UCSBOrganization.builder()
        .orgCode("ZPR")
        .orgTranslationShort("ZETA PHI RHO")
        .orgTranslation("ZETA PHI RHO")
        .inactive(false)
        .build();

        UCSBOrganization zetaPhiRhoEdited = UCSBOrganization.builder()
                .orgCode("ZPRNEW")
                .orgTranslationShort("ZETAS")
                .orgTranslation("ZETA PHI RHOS")
                .inactive(true)
                .build();

        String requestBody = mapper.writeValueAsString(zetaPhiRhoEdited);

        when(ucsbOrganizationRepository.findById(eq("ZPR"))).thenReturn(Optional.of(zetaPhiRhoOrig));

        // act
        MvcResult response = mockMvc.perform(
                put("/api/ucsborganization?orgCode=ZPR")
                                .contentType(MediaType.APPLICATION_JSON)
                                .characterEncoding("utf-8")
                                .content(requestBody)
                                .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        // assert
        verify(ucsbOrganizationRepository, times(1)).findById("ZPR");
        verify(ucsbOrganizationRepository, times(1)).save(zetaPhiRhoEdited); // should be saved with updated info
        String responseString = response.getResponse().getContentAsString();
        assertEquals(requestBody, responseString);
    }
}