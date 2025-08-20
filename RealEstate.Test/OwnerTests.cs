using NUnit.Framework;
using RealEstate.Domain;
using MongoDB.Bson;

namespace RealEstate.Test
{
    public class OwnerTests
    {
        [Test]
        public void Owner_CanBeCreated_WithDefaultValues()
        {
            var owner = new Owner();
            Assert.That(owner.Name, Is.EqualTo(string.Empty));
            Assert.That(owner.Address, Is.EqualTo(string.Empty));
            Assert.That(owner.Photo, Is.EqualTo(string.Empty));
            Assert.That(owner.Birthday, Is.Null);
        }

        [Test]
        public void Owner_Id_IsObjectId()
        {
            var owner = new Owner();
            Assert.That(owner.Id, Is.TypeOf<ObjectId>());
        }
    }
}