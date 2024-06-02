﻿using System.ComponentModel.DataAnnotations;

namespace OTTER.Dtos
{
    public class UserInputDto
    {
        [Required]
        public string UserEmail { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        public int RoleID { get; set; }
        [Required]
        public int OrganizationID { get; set; }
        public string? OtherRole { get; set; }
    }
}