using NUnit.Framework;
using RealEstate.Domain;
using MongoDB.Bson;

namespace RealEstate.Test
{
    public class PropertyTests
    {
        [Test]
        public void Property_CanBeCreated_WithDefaultValues()
        {
            var property = new Property();
            Assert.That(property.Images, Is.Not.Null);
            Assert.That(property.Traces, Is.Not.Null);
            Assert.That(property.Name, Is.EqualTo(string.Empty));
            Assert.That(property.Address, Is.EqualTo(string.Empty));
            Assert.That(property.CodeInternal, Is.EqualTo(string.Empty));
            Assert.That(property.OwnerId, Is.EqualTo(string.Empty));
        }

        [Test]
        public void Property_Id_IsObjectId()
        {
            var property = new Property();
            Assert.That(property.Id, Is.TypeOf<ObjectId>());
        }
    }
}